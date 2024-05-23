import { ResultSetHeader, RowDataPacket } from "mysql2";

import db from "../database";
import OperationError from "../utils/error";

/**
 * Interfaces
 */

export interface ISupplier {
  supplierId: number;
  name: string;
  description: string;
  RFC: string;
  tin: string;
  phone: string;
  address: string;
  active: boolean;
  updatedAt: string;
  createdAt: string;
}

export type ICreateSupplier = Omit<
  ISupplier,
  "supplierId" | "createdAt" | "updatedAt"
>;

export type IUpdateSupplier = ICreateSupplier;

interface IGetAllFilters {
  limit?: number;
  sort?: "asc" | "desc";
  status?: "all" | "active" | "inactive";
}

/**
 * Methods
 */

const exists = async (supplierId: number | boolean): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      select 
       supplierId
      from suppliers
      where supplierId=?
    `,
      [supplierId],
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
}: IGetAllFilters): Promise<ISupplier[]> => {
  try {
    const amount = limit ? `limit ${limit}` : "";
    const active = status != "all" ? `where active=${status == "active"}` : "";

    const [rows] = await db.query(`
      select 
        *
      from suppliers ${active}
      order by createdAt ${sort} ${amount}
    `);

    const data = rows as ISupplier[];
    return data;
  } catch (ex) {
    console.log(ex);
    return [];
  }
};

const getById = async (
  supplierId: number | string,
): Promise<ISupplier | undefined> => {
  try {
    const [rows] = await db.query(
      `
      select 
        *
      from suppliers
      where supplierId=?
    `,
      [supplierId],
    );

    const data = rows as RowDataPacket[];
    if (data.length == 0) throw new OperationError(400, "Not found");
    return data[0] as ISupplier;
  } catch (ex) {
    console.log(ex);
    return undefined;
  }
};

const create = async ({
  name,
  description,
  RFC,
  tin,
  phone,
  address,
  active,
}: ICreateSupplier): Promise<number> => {
  try {
    const [rows] = await db.query(
      `
      insert into users (
        name,
        description,
        RFC,
        tin,
        phone,
        address,
        active,
      ) values(?, ?, ?, ?, ?, ?, ?)
    `,
      [name, description, RFC, tin, phone, address, active],
    );

    const { insertId } = rows as ResultSetHeader;
    return insertId as number;
  } catch (ex) {
    console.log(ex);
    return -1;
  }
};

const update = async (
  supplierId: number | string,
  { name, description, RFC, tin, phone, address, active }: IUpdateSupplier,
): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      UPDATE  
        suppliers 
      SET 
        name=?,
        description=?,
        RFC=?,
        tin=?,
        phone=?,
        address=?,
        active=?
      WHERE supplierId=?
    `,
      [name, description, RFC, tin, phone, address, active, supplierId],
    );

    const { affectedRows } = rows as ResultSetHeader;
    return affectedRows > 0;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};

const remove = async (supplierId: number | string): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      update
        suppliers 
      set
        active=? 
      where
        supplierId=?
    `,
      [false, supplierId],
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
