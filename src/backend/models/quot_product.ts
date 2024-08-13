import { ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../database";
import OperationError from "../utils/error";
import Quotation, { IQuotation } from "./quotation";
import Cucop from "./cucop";
import Product, { IProduct } from "./product";

/**
 * Interfaces
 */

export interface IQuotProduct {
  quotProductId: number;
  quotationId: number;
  productId: number;
  quantity: string;
  price: string;
  totalPrice: string;
  details: string;
  active: boolean;
  updatedAt: string;
  createdAt: string;
  quotation?: IQuotation;
  product?: IProduct;
}

export type ICreateQuotProduct = Omit<
  IQuotProduct,
  | "quotProductId"
  | "totalPrice"
  | "createdAt"
  | "updatedAt"
  | "quotation"
  | "product"
>;

export type IUpdateQuotProduct = ICreateQuotProduct;

interface IGetAllFilters {
  limit?: number;
  sort?: "asc" | "desc";
  status?: "all" | "active" | "inactive";
}

/**
 * Methods
 */

const exists = async (quotProductId: number | boolean): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        quotProductId
      FROM quotations_products
      WHERE quotProductId=?
    `,
      [quotProductId],
    );

    const data = rows as RowDataPacket[];
    if (data.length === 0) throw new OperationError(400, "Not found");
    return true;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};

const getAll = async ({
  limit,
  sort = "desc",
  status = "all",
}: IGetAllFilters): Promise<IQuotProduct[]> => {
  try {
    const amount = limit ? `LIMIT ${limit}` : "";
    const active =
      status !== "all" ? `WHERE active=${status === "active"}` : "";

    const [rows] = await db.query(`
      SELECT 
        *
      FROM quotations_products ${active}
      ORDER BY createdAt ${sort} ${amount}
    `);

    const data = rows as IQuotProduct[];
    await Promise.all(
      data.map(async (quotpro) => {
        const quot = await Quotation.getById(quotpro.quotationId);
        const product = await Product.getById(quotpro.productId);
        quotpro.quotation = quot;
        quotpro.product = product;
      }),
    );
    return data;
  } catch (ex) {
    console.log(ex);
    return [];
  }
};

const getById = async (
  quotProductId: number | string,
): Promise<IQuotProduct | undefined> => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        *
      FROM quotations_products
      WHERE quotProductId=?
    `,
      [quotProductId],
    );

    const data = rows as RowDataPacket[];
    if (data.length === 0) throw new OperationError(400, "Not found");
    const quotpro = data[0] as IQuotProduct;
    const quot = await Quotation.getById(quotpro.quotationId);
    const product = await Product.getById(quotpro.productId);
    quotpro.quotation = quot;
    quotpro.product = product;
    return quotpro;
  } catch (ex) {
    console.log(ex);
    return undefined;
  }
};

const getByQuotId = async (
  QuotId: number | string,
): Promise<IQuotProduct[]> => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        *
      FROM quotations_products
      WHERE quotationId=?
      ORDER BY createdAt
    `,
      [QuotId],
    );
    const data = rows as IQuotProduct[];
    await Promise.all(
      data.map(async (quotpro) => {
        const quot = await Quotation.getById(quotpro.quotationId);
        const product = await Product.getById(quotpro.productId);
        quotpro.quotation = quot;
        quotpro.product = product;
      }),
    );
    return data;
  } catch (ex) {
    console.log(ex);
    return [];
  }
};

const create = async ({
  productId,
  quotationId,
  quantity,
  price,
  details = "N/A",
  active,
}: ICreateQuotProduct): Promise<number> => {
  try {
    const [rows] = await db.query(
      `
      INSERT INTO quotations_products (
        productId,
        quotationId,
        quantity,
        price,
        details,
        active
      ) VALUES (?, ?, ?, ?, ?, ?)
    `,
      [productId, quotationId, quantity, price, details, active],
    );

    const { insertId } = rows as ResultSetHeader;
    return insertId as number;
  } catch (ex) {
    console.log(ex);
    return -1;
  }
};

const parseCSVLine = (line: string): string[] => {
  const fields: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      fields.push(field.trim());
      field = "";
    } else {
      field += char;
    }
  }

  fields.push(field.trim());

  return fields;
};

const load = async (fileBuffer: Buffer, qid: number | string) => {
  const logs = [];
  let ecount = 0;
  try {
    logs.push({
      time: new Date().toISOString(),
      type: "info",
      message: "Archivo recibido correctamente",
    });

    const content = fileBuffer.toString("utf-8");
    const lines = content.split("\n");
    let c = 1;
    const cgen = await Cucop.getDefalt();
    for (const line of lines.slice(1)) {
      logs.push({
        time: new Date().toISOString(),
        type: "info",
        message: `Procesado fila #${c}`,
      });
      const [Producto, Cantidad, Precio, Detalles] = parseCSVLine(line);
      let pid = 0;

      // Buscar si existe el producto
      const prod = await Product.getByName(Producto);

      // Si existe tomar su id y si no crearlo
      if (prod) {
        pid = prod.productId;
      } else {
        if (cgen == 0) {
          logs.push({
            time: new Date().toISOString(),
            type: "error",
            message: `Fila #${c}: Error al registrar nuevo producto `,
          });
          ecount++;
          c++;
          continue; // Saltar al siguiente elemento del bucle
        }
        pid = await Product.create({
          cucopId: cgen,
          name: Producto,
          description: "N/A",
          active: true,
        });
        if (!pid) {
          logs.push({
            time: new Date().toISOString(),
            type: "error",
            message: `Fila #${c}: Error al registrar nuevo producto`,
          });
          ecount++;
          c++;
          continue; // Saltar al siguiente elemento del bucle
        }
        logs.push({
          time: new Date().toISOString(),
          type: "succes",
          message: `Fila #${c}: Producto registrado correctamente`,
        });
      }

      const iqp = await create({
        productId: pid,
        quotationId: Number(qid), // Convertir a número
        quantity: Cantidad,
        price: Precio,
        details: Detalles || "N/A",
        active: true,
      });
      if (iqp) {
        logs.push({
          time: new Date().toISOString(),
          type: "success",
          message: `Fila #${c}: Producto añadido a la cotización correctamente`,
        });
        logs.push({
          time: new Date().toISOString(),
          type: "success",
          message: `Fila #${c}: Procesada correctamente`,
        });
      } else {
        logs.push({
          time: new Date().toISOString(),
          type: "error",
          message: `Fila #${c}: Error al añadir producto a la cotización`,
        });
        ecount++;
        c++;
        continue;
      }
      c++;
    }
  } catch (ex) {
    console.log(ex);
    ecount++;
    return `Error al procesar el Archivo: ${ex}`;
  }
  if (ecount > 0) {
    logs.push({
      time: new Date().toISOString(),
      type: "error",
      message: `Se encontraron ${ecount} errores `,
    });
  }
  return logs;
};

const update = async (
  quotProductId: number | string,
  {
    productId,
    quotationId,
    quantity,
    price,
    details = "N/A",
    active,
  }: IUpdateQuotProduct,
): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      UPDATE  
        quotations_products 
      SET 
        productId=?,
        quotationId=?,
        quantity=?,
        price=?,
        details=?,
        active=?
      WHERE quotProductId=?
    `,
      [productId, quotationId, quantity, price, details, active, quotProductId],
    );

    const { affectedRows } = rows as ResultSetHeader;
    return affectedRows > 0;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};

const remove = async (quotProductId: number | string): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      UPDATE
        quotations_products 
      SET
        active=? 
      WHERE
        quotProductId=?
    `,
      [false, quotProductId],
    );

    const { affectedRows } = rows as ResultSetHeader;
    return affectedRows > 0;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};

export default {
  exists,
  getAll,
  getById,
  getByQuotId,
  create,
  load,
  update,
  remove,
};
