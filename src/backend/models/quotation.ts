import { ResultSetHeader, RowDataPacket } from "mysql2";

import db from "../database";
import OperationError from "../utils/error";
import Supplier, { ISupplier } from "./supplier";

/**
 * Interfaces
 */

export interface IQuotation {
  quotationId: number;
  listId: number;
  supplierId: number;
  description: string;
  quotNumber: string;
  date: string;
  active: boolean;
  updatedAt: string;
  createdAt: string;
  supplier?: ISupplier;
}

export type ICreateQuotation = Omit<
  IQuotation,
  "quotationId" | "createdAt" | "updatedAt" | "supplier"
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
    await Promise.all(
      data.map(async (cotiz) => {
        const cotizprov = await Supplier.getById(cotiz.supplierId);
        cotiz.supplier = cotizprov;
      }),
    );
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
      from quotations
      where quotationId=?
    `,
      [quotationId],
    );

    const data = rows as RowDataPacket[];
    if (data.length == 0) throw new OperationError(400, "Not found");
    const quota = data[0] as IQuotation;
    quota.supplier = await Supplier.getById(quota.supplierId);
    return quota;
  } catch (ex) {
    console.log(ex);
    return undefined;
  }
};

const getByList = async (listId: number | string): Promise<IQuotation[]> => {
  try {
    const [rows] = await db.query(
      `
      select 
        *
      from quotations
      where listId=?
      order by createdAt
    `,
      [listId],
    );

    const data = rows as IQuotation[];
    await Promise.all(
      data.map(async (cotiz) => {
        const cotizprov = await Supplier.getById(cotiz.supplierId);
        cotiz.supplier = cotizprov;
      }),
    );
    return data;
  } catch (ex) {
    console.log(ex);
    return [];
  }
};

const create = async ({
  listId,
  supplierId,
  description,
  date,
  quotNumber,
  active,
}: ICreateQuotation): Promise<number> => {
  try {
    const [rows] = await db.query(
      `
      insert into quotations (
        listId,
        supplierId,
        description,
        quotNumber,
        date,
        active
      ) values(?, ?, ?, ?, ?, ?)
    `,
      [listId, supplierId, description, quotNumber ?? "S/N", date, active],
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
    listId,
    supplierId,
    description,
    quotNumber,
    date,
    active,
  }: IUpdateQuotation,
): Promise<boolean> => {
  try {
    if (!quotNumber) {
      quotNumber = "Sin numero";
    }
    const [rows] = await db.query(
      `
      UPDATE  
        quotations 
      SET 
        listId=?,
        supplierId=?,
        description=?,
        quotNumber=?,
        date=?,
        active=?
      WHERE quotationId=?
    `,
      [listId, supplierId, description, quotNumber, date, active, quotationId],
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
  getByList,
  create,
  update,
  remove,
};
