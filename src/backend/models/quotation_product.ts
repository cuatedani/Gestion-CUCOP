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
  discount: number;
  subtotal: number;
  IVA: number;
  amountIVA: number;
  ISR: number;
  amountISR: number;
  totalPrice: number;
  active: boolean;
  updatedAt: string;
  createdAt: string;
  quotation?: IQuotation;
  product?: IProduct;
}

export type ICreateQuotProduct = Omit<
  IQuotationProduct,
  | "quotProductId"
  | "subtotal"
  | "amountIVA"
  | "amountISR"
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
      FROM quotation_products
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
  quotationId,
}: {
  quotationId?: number;
}): Promise<IQuotationProduct[]> => {
  try {
    let query = "SELECT * FROM quotation_products WHERE 1=1";
    const queryParams: number[] = [];

    if (quotationId) {
      console.log("Llego este QID: ", quotationId);
      query += " AND quotationId = ?";
      queryParams.push(Number(quotationId));
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
      FROM quotation_products
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
  discount,
  IVA,
  ISR,
  active,
}: ICreateQuotProduct): Promise<number> => {
  try {
    const [rows] = await db.query(
      `
      INSERT INTO quotation_products (
        productId,
        quotationId,
        quantity,
        price,
        discount,
        IVA,
        ISR,
        active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        Number(productId),
        Number(quotationId),
        Number(quantity),
        Number(price),
        discount ? Number(discount) : 0.0,
        IVA ? Number(IVA) : 0.0,
        ISR ? Number(ISR) : 0.0,
        active,
      ],
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
      const [
        clavecucop,
        Producto,
        Marca,
        Modelo,
        Denominacion,
        Descripcion,
        Cantidad,
        Precio,
        Descuento,
        IVA,
        ISR,
      ] = parseCSVLine(line);

      // Buscar si existe el producto
      let prod = await Product.existsName(Producto);
      const exclave = await Cucop.existsClave(clavecucop);
      // Si existe tomar su id y si no crearlo
      if (prod <= 0) {
        if (cgen == 0 && !exclave) {
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
        prod = await Product.create({
          cucopId: exclave ? exclave : cgen,
          name: Producto,
          description: Descripcion,
          brand: Marca,
          model: Modelo,
          denomination: Denominacion,
          serialNumber: "",
          itemNumber: "",
          active: true,
        });
        if (prod <= 0) {
          logs.push(
            Log.createLog(
              "error",
              `Fila #${c}: Error al registrar nuevo producto`,
            ),
          );
          ecount++;
          c++;
          continue;
        }
        logs.push(
          Log.createLog(
            "success",
            `Fila #${c}: Producto registrado correctamente`,
          ),
        );
      }

      let iqp = null;
      const validIVA = [0.0, 0.16, 0.08];
      const validISR = [0.0, 0.0125];

      // Validación de los campos y acumulación de errores
      const errorMessages = [];

      if (isNaN(Number(Cantidad))) {
        errorMessages.push(`Cantidad no válida: ${Cantidad}`);
      }
      if (isNaN(Number(Precio))) {
        errorMessages.push(`Precio no válido: ${Precio}`);
      }
      if (
        isNaN(Number(Descuento)) &&
        Number(Descuento) >= 0 &&
        Number(Descuento) < 1
      ) {
        errorMessages.push(`Descuento no válido: ${Descuento}`);
      }
      if (isNaN(Number(IVA)) || !validIVA.includes(Number(IVA))) {
        errorMessages.push(`IVA no válido: ${IVA}`);
      }
      if (isNaN(Number(ISR)) || !validISR.includes(Number(ISR))) {
        errorMessages.push(`ISR no válido: ${ISR}`);
      }

      if (errorMessages.length > 0) {
        logs.push(
          Log.createLog("error", `Fila #${c}: ${errorMessages.join(", ")}`),
        );
        ecount++;
        c++;
        continue; // Saltar al siguiente elemento del bucle
      }

      // Crear QuotProduct si los datos son válidos
      iqp = await create({
        productId: prod,
        quotationId: Number(qid),
        quantity: Number(Cantidad),
        price: Number(Precio),
        discount: Number(Descuento),
        IVA: Number(IVA),
        ISR: Number(ISR),
        active: true,
      });

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
    discount,
    IVA,
    ISR,
    active,
  }: IUpdateQuotProduct,
): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      UPDATE  
        quotation_products 
      SET 
        productId=?,
        quotationId=?,
        quantity=?,
        price=?,
        discount=?,
        IVA=?,
        ISR=?,
        active=?
      WHERE quotProductId=?
    `,
      [
        Number(productId),
        Number(quotationId),
        Number(quantity),
        Number(price),
        discount ? Number(discount) : 0.0,
        IVA ? Number(IVA) : 0.0,
        ISR ? Number(ISR) : 0.0,
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
        quotation_products 
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
