import { ResultSetHeader, RowDataPacket } from "mysql2";

import db from "../database";
import OperationError from "../utils/error";
import { ICustomer } from "./customer";

/**
 * Interfaces
 */

export type ICheckType = "checkIn" | "checkOut" | "justify" | "NA";

export interface ICheck {
  checkId: number;
  customerId: number;
  type: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  customer: ICustomer;
}

export type ICreateCheck = Omit<
  ICheck,
  "checkId" | "createdAt" | "updatedAt" | "customer"
>;

export type IUpdateCheck = ICreateCheck;

export interface IGetAllFilters {
  limit?: number;
  sort?: "asc" | "desc";
  type?: ICheckType;
  status?: "all" | "active" | "inactive";
  customerId?: number;
  startDate?: string | Date | undefined;
  endDate?: string | Date | undefined;
  sortField?: string;
}

/**
 * Methods
 */

const getAll = async ({
  limit,
  sort = "desc",
  type,
  status = "all",
  customerId,
  startDate,
  endDate,
}: IGetAllFilters): Promise<ICheck[]> => {
  try {
    const amount = limit ? `limit ${limit}` : "";
    let where = "where checkId>0";
    if (customerId) {
      where += `and customerId = ${customerId}`;
    }
    if (startDate) {
      where += ` and createdAt >= '${startDate}'`;
    }
    if (endDate) {
      where += ` and createdAt <= '${endDate}'`;
    }
    if (type) {
      where += ` and type = '${type}'`;
    }
    if (status && status != "all") {
      where += ` and active = ${status == "active"}`;
    }
    const [rows] = await db.query(`
      select 
        *
      from checks_view
      ${where}
      order by checkId ${sort} ${amount} 
    `);
    const data = rows as ICheck[];

    return data;
  } catch (ex) {
    console.log(ex);
    return [];
  }
};

const getById = async (
  checkId: number | string,
): Promise<ICheck | undefined> => {
  try {
    const [rows] = await db.query(
      `
      select 
        *
      from checks_view
      where checkId=?
    `,
      [checkId],
    );

    const data = rows as RowDataPacket[];
    if (data.length == 0) throw new OperationError(404, "Not found");
    return data[0] as ICheck;
  } catch (ex) {
    console.log(ex);
    return undefined;
  }
};

const create = async ({
  customerId,
  type,
  active = true,
}: ICreateCheck): Promise<number> => {
  try {
    const [rows] = await db.query(
      `
      insert into checks(
        customerId,
        type,
        active
      ) 
      values(?, ?, ?)
    `,
      [customerId, type, active ? 1 : 0],
    );

    const { insertId } = rows as ResultSetHeader;
    if (insertId == 0) throw new OperationError(400, "Error creating");
    return insertId as number;
  } catch (ex) {
    console.log(ex);
    return -1;
  }
};

const update = async (
  checkId: number | string,
  { customerId, type }: IUpdateCheck,
): Promise<boolean> => {
  const [rows] = await db.query(
    `
      update  
        checks 
      set 
        customerId=?,
        type=?
      where checkId=?
    `,
    [customerId, type, checkId],
  );

  const { affectedRows } = rows as ResultSetHeader;
  return affectedRows > 0;
};

const remove = async (checkId: number | string): Promise<boolean> => {
  const [rows] = await db.query(
    `
      update 
        checks
      set 
        active=?
      where 
        checkId=? 
    `,
    [false, checkId],
  );

  const { affectedRows } = rows as ResultSetHeader;
  return affectedRows > 0;
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
};
