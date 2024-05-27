import { ResultSetHeader, RowDataPacket } from "mysql2";

import db from "../database";
import OperationError from "../utils/error";
import { ICucop } from "./cucop";

/**
 * Interfaces
 */

export interface IProduct {
  productId: number;
  cucopId: number;
  name: string;
  description: string;
  active: boolean;
  updatedAt: string;
  createdAt: string;
  cucop: ICucop;
}

export type ICreateProduct = Omit<
  IProduct,
  "productId" | "createdAt" | "updatedAt"
>;

export type IUpdateProduct = ICreateProduct;

interface IGetAllFilters {
  limit?: number;
  sort?: "asc" | "desc";
  status?: "all" | "active" | "inactive";
}

/**
 * Methods
 */

const exists = async (productId: number | boolean): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      select 
        productId
      from products
      where productId=?
    `,
      [productId],
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
}: IGetAllFilters): Promise<IProduct[]> => {
  try {
    const amount = limit ? `limit ${limit}` : "";
    const active = status != "all" ? `where active=${status == "active"}` : "";

    const [rows] = await db.query(`
      select 
        *
      from products ${active}
      order by createdAt ${sort} ${amount}
    `);

    const data = rows as IProduct[];
    return data;
  } catch (ex) {
    console.log(ex);
    return [];
  }
};

const getById = async (
  productId: number | string,
): Promise<IProduct | undefined> => {
  try {
    const [rows] = await db.query(
      `
      select 
        *
      from products
      where productId=?
    `,
      [productId],
    );

    const data = rows as RowDataPacket[];
    if (data.length == 0) throw new OperationError(400, "Not found");
    return data[0] as IProduct;
  } catch (ex) {
    console.log(ex);
    return undefined;
  }
};

const create = async ({
  cucopId,
  name,
  description,
  active,
}: ICreateProduct): Promise<number> => {
  try {
    const [rows] = await db.query(
      `
      insert into products (
        cucopId,
        name,
        description,
        active
      ) values(?, ?, ?, ?)
    `,
      [cucopId, name, description, active],
    );

    const { insertId } = rows as ResultSetHeader;
    return insertId as number;
  } catch (ex) {
    console.log(ex);
    return -1;
  }
};

const update = async (
  productId: number | string,
  { cucopId, name, description, active }: IUpdateProduct,
): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      UPDATE  
        products 
      SET 
        cucopId=?,
        name=?,
        description=?,
        active=?
      WHERE productId=?
    `,
      [cucopId, name, description, active, productId],
    );

    const { affectedRows } = rows as ResultSetHeader;
    return affectedRows > 0;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};

const remove = async (productId: number | string): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      update
        products 
      set
        active=? 
      where
        productId=?
    `,
      [false, productId],
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
