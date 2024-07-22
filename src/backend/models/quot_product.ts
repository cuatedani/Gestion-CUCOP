import { ResultSetHeader, RowDataPacket } from "mysql2";

import db from "../database";
import OperationError from "../utils/error";
import Quotation, { IQuotation } from "./quotation";
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
      select 
        quotProductId
      from quotations_products
      where quotProductId=?
    `,
      [quotProductId],
    );

    const data = rows as RowDataPacket[];
    if (data.length == 0) throw new OperationError(400, "Not found");
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
    const amount = limit ? `limit ${limit}` : "";
    const active = status != "all" ? `where active=${status == "active"}` : "";

    const [rows] = await db.query(`
      select 
        *
      from quotations_products ${active}
      order by createdAt ${sort} ${amount}
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
      select 
        *
      from quotations_products
      where quotProductId=?
    `,
      [quotProductId],
    );

    const data = rows as RowDataPacket[];
    if (data.length == 0) throw new OperationError(400, "Not found");
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
      select 
        *
      from quotations_products
      where quotationId=?
      order by createdAt
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
  details,
  active,
}: ICreateQuotProduct): Promise<number> => {
  try {
    const [rows] = await db.query(
      `
      insert into quotations_products (
        productId,
        quotationId,
        quantity,
        price,
        details,
        active
      ) values(?, ?, ?, ?, ?, ?)
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
      update
        quotations_products 
      set
        active=? 
      where
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
  update,
  remove,
};
