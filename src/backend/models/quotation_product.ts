import { ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../database";
import OperationError from "../utils/error";
import Quotation, { IQuotation } from "./quotation";
import Cucop from "./cucop";
import Product, { IProduct } from "./product";
import Log, { ILog } from "./log";

/**
 * Interfaces
 */

export interface IQuotationProduct {
  quotProductId: number;
  quotationId: number;
  productId: number;
  quantity: number;
  price: number;
  totalPrice: number;
  details: string;
  active: boolean;
  updatedAt: string;
  createdAt: string;
  quotation?: IQuotation;
  product?: IProduct;
}

export type ICreateQuotProduct = Omit<
  IQuotationProduct,
  | "quotProductId"
  | "totalPrice"
  | "createdAt"
  | "updatedAt"
  | "quotation"
  | "product"
>;

export type IUpdateQuotProduct = ICreateQuotProduct;

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
  quotaionId,
}: {
  quotaionId?: number;
}): Promise<IQuotationProduct[]> => {
  try {
    let query = "SELECT * FROM quotations_products WHERE 1=1";
    const queryParams: number[] = [];

    if (quotaionId) {
      query += " AND partidaespecifica = ?";
      queryParams.push(Number(quotaionId));
    }
    const [rows] = await db.query(query, queryParams);
    const data = rows as IQuotationProduct[];
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
): Promise<IQuotationProduct | undefined> => {
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
    const quotpro = data[0] as IQuotationProduct;
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

const create = async ({
  productId,
  quotationId,
  quantity,
  price,
  details,
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
      [productId, quotationId, quantity, price, details ?? "N/A", active],
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
  const logs: ILog[] = [];
  let ecount = 0;
  try {
    logs.push(Log.createLog("info", "Archivo recibido correctamente"));

    const content = fileBuffer.toString("utf-8");
    const lines = content.split("\n");
    let c = 1;
    const cgen = await Cucop.getDefalt();
    for (const line of lines.slice(1)) {
      logs.push(Log.createLog("info", `Procesado fila #${c}`));
      const [Producto, Cantidad, Precio, Detalles] = parseCSVLine(line);
      let pid = 0;

      // Buscar si existe el producto
      const prod = await Product.existsName(Producto);

      // Si existe tomar su id y si no crearlo
      if (prod != 0) {
        pid = prod;
      } else {
        if (cgen == 0) {
          logs.push(
            Log.createLog(
              "error",
              `Fila #${c}: Error al registrar nuevo producto`,
            ),
          );
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
          logs.push(
            Log.createLog(
              "error",
              `Fila #${c}: Error al registrar nuevo producto`,
            ),
          );
          ecount++;
          c++;
          continue; // Saltar al siguiente elemento del bucle
        }
        logs.push(
          Log.createLog(
            "success",
            `Fila #${c}: Producto registrado correctamente`,
          ),
        );
      }
      let iqp = null;
      if (!isNaN(Number(Cantidad)) && !isNaN(Number(Precio))) {
        iqp = await create({
          productId: pid,
          quotationId: Number(qid),
          quantity: Number(Cantidad),
          price: Number(Precio),
          details: Detalles,
          active: true,
        });
      }
      if (iqp) {
        logs.push(
          Log.createLog(
            "success",
            `Fila #${c}: Producto añadido a la cotización correctamente`,
          ),
        );
        logs.push(
          Log.createLog("success", `Fila #${c}: Procesada correctamente`),
        );
      } else {
        logs.push(
          Log.createLog(
            "error",
            `Fila #${c}: Error al añadir producto a la cotización`,
          ),
        );
        logs.push(Log.createLog("error", `Fila #${c}: Error al procesar`));
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
    logs.push(Log.createLog("error", `Se encontraron ${ecount} errores `));
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
    details,
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
      [
        productId,
        quotationId,
        quantity,
        price,
        details ?? "N/A",
        active,
        quotProductId,
      ],
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
  create,
  load,
  update,
  remove,
};
