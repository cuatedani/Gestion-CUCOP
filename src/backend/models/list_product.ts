import { ResultSetHeader, RowDataPacket } from "mysql2";

import db from "../database";
import OperationError from "../utils/error";

/**
 * Interfaces
 */

// AQUI CONTINUA EL DESARROLLO

export interface IList_Product {
  list_productId: number;
  listId: number;
  productId: number;
  quantity: string;
  price: string;
  active: boolean;
  updatedAt: string;
  createdAt: string;
}

export type ICreateList_Product = Omit<
  IList_Product,
  "list_productId" | "createdAt" | "updatedAt"
>;

export type IUpdateList_Product = ICreateList_Product;

interface IGetAllFilters {
  limit?: number;
  sort?: "asc" | "desc";
  status?: "all" | "active" | "inactive";
}

/**
 * Methods
 */

const exists = async (list_productId: number | boolean): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      select 
        list_productId
      from list_products
      where list_productId=?
    `,
      [list_productId],
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
}: IGetAllFilters): Promise<IList_Product[]> => {
  try {
    const amount = limit ? `limit ${limit}` : "";
    const active = status != "all" ? `where active=${status == "active"}` : "";

    const [rows] = await db.query(`
      select 
        *
      from list_products ${active}
      order by createdAt ${sort} ${amount}
    `);

    const data = rows as IList_Product[];
    return data;
  } catch (ex) {
    console.log(ex);
    return [];
  }
};

const getById = async (
  list_productId: number | string,
): Promise<IList_Product | undefined> => {
  try {
    const [rows] = await db.query(
      `
      select 
        *
      from list_products
      where list_productId=?
    `,
      [list_productId],
    );

    const data = rows as RowDataPacket[];
    if (data.length == 0) throw new OperationError(400, "Not found");
    return data[0] as IList_Product;
  } catch (ex) {
    console.log(ex);
    return undefined;
  }
};

const create = async ({
  listId,
  productId,
  quantity,
  price,
  active,
}: ICreateList_Product): Promise<number> => {
  try {
    const [rows] = await db.query(
      `
      insert into list_products (
        listId,
        productId,
        quantity,
        price,
        active
      ) values(?, ?, ?, ?, ?)
    `,
      [listId, productId, quantity, price, active],
    );

    const { insertId } = rows as ResultSetHeader;
    return insertId as number;
  } catch (ex) {
    console.log(ex);
    return -1;
  }
};

const update = async (
  list_productId: number | string,
  { listId, productId, quantity, price, active }: IUpdateList_Product,
): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      UPDATE  
        list_products 
      SET 
        listId=?,
        productId=?,
        quantity=?,
        price=?,
        active=?,
      WHERE list_productId=?
    `,
      [listId, productId, quantity, price, active, list_productId],
    );

    const { affectedRows } = rows as ResultSetHeader;
    return affectedRows > 0;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};

const remove = async (list_productId: number | string): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      update
        list_products 
      set
        active=? 
      where
        list_productId=?
    `,
      [false, list_productId],
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
