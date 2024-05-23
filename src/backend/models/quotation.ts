import { ResultSetHeader, RowDataPacket } from "mysql2";

import db from "../database";
import OperationError from "../utils/error";

/**
 * Interfaces
 */

export interface IQuotation {
  quotationId: number;
  productId: number;
  supplierId: number;
  price: number;
  quotationDate: string;
  description: string;
  active: boolean;
  updatedAt: string;
  createdAt: string;
}

export type ICreateQuotation = Omit<
  IQuotation,
  "quotationId" | "createdAt" | "updatedAt"
>;

export type IUpdateQuotation = ICreateQuotation;

interface IGetAllFilters {
  limit?: number;
  sort?: "asc" | "desc";
  status?: "all" | "active" | "inactive";
}

/**
 * Methods
 */

const exists = async (quotationId: number | boolean): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      select
        quotationId
      from quotations
      where quotationId=?
    `,
      [quotationId],
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
}: IGetAllFilters): Promise<IQuotation[]> => {
  try {
    const amount = limit ? `limit ${limit}` : "";
    const active = status != "all" ? `where active=${status == "active"}` : "";

    const [rows] = await db.query(`
      select 
        *
      from quotations ${active}
      order by createdAt ${sort} ${amount}
    `);

    const data = rows as IQuotation[];
    return data;
  } catch (ex) {
    console.log(ex);
    return [];
  }
};

const getById = async (
  quotationId: number | string,
): Promise<IQuotation | undefined> => {
  try {
    const [rows] = await db.query(
      `
      select 
        *
      from quotation
      where quotationId=?
    `,
      [quotationId],
    );

    const data = rows as RowDataPacket[];
    if (data.length == 0) throw new OperationError(400, "Not found");
    return data[0] as IQuotation;
  } catch (ex) {
    console.log(ex);
    return undefined;
  }
};

const create = async ({
  productId,
  supplierId,
  price,
  quotationDate,
  description,
  active,
}: ICreateQuotation): Promise<number> => {
  try {
    const [rows] = await db.query(
      `
      insert into quotations (
        productId,
        supplierId,
        price,
        quotationDate,
        description,
        active
      ) values(?, ?, ?, ?, ?, ?)
    `,
      [productId, supplierId, price, quotationDate, description, active],
    );

    const { insertId } = rows as ResultSetHeader;
    return insertId as number;
  } catch (ex) {
    console.log(ex);
    return -1;
  }
};

const update = async (
  quotationId: number | string,
  {
    productId,
    supplierId,
    price,
    quotationDate,
    description,
    active,
  }: IUpdateQuotation,
): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      UPDATE  
        quotations 
      SET 
        productId=?,
        supplierId=?,
        price=?,
        quotationDate=?,
        description=?,
        active=?
      WHERE userId=?
    `,
      [
        productId,
        supplierId,
        price,
        quotationDate,
        description,
        active,
        quotationId,
      ],
    );

    const { affectedRows } = rows as ResultSetHeader;
    return affectedRows > 0;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};

const remove = async (quotationId: number | string): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      update
        quotations 
      set
        active=? 
      where
        quotationId=?
    `,
      [false, quotationId],
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
  update,
  remove,
};
