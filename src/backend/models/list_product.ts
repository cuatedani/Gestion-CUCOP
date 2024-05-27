import { ResultSetHeader, RowDataPacket } from "mysql2";

import db from "../database";
import OperationError from "../utils/error";
import { IList } from "./list";
import { IProduct } from "./product";

/**
 * Interfaces
 */

export interface IListProduct {
  listProductId: number;
  listId: number;
  productId: number;
  quantity: string;
  price: string;
  active: boolean;
  updatedAt: string;
  createdAt: string;
  list: IList;
  product: IProduct;
}

export type ICreateListProduct = Omit<
  IListProduct,
  "listProductId" | "createdAt" | "updatedAt"
>;

export type IUpdateListProduct = ICreateListProduct;

interface IGetAllFilters {
  limit?: number;
  sort?: "asc" | "desc";
  status?: "all" | "active" | "inactive";
}

/**
 * Methods
 */

const exists = async (listProductId: number | boolean): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      select 
        listProductId
      from list_products
      where listProductId=?
    `,
      [listProductId],
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
}: IGetAllFilters): Promise<IListProduct[]> => {
  try {
    const amount = limit ? `limit ${limit}` : "";
    const active = status != "all" ? `where active=${status == "active"}` : "";

    const [rows] = await db.query(`
      select 
        *
      from list_products ${active}
      order by createdAt ${sort} ${amount}
    `);

    const data = rows as IListProduct[];
    return data;
  } catch (ex) {
    console.log(ex);
    return [];
  }
};

const getById = async (
  listProductId: number | string,
): Promise<IListProduct | undefined> => {
  try {
    const [rows] = await db.query(
      `
      select 
        *
      from list_products
      where listProductId=?
    `,
      [listProductId],
    );

    const data = rows as RowDataPacket[];
    if (data.length == 0) throw new OperationError(400, "Not found");
    return data[0] as IListProduct;
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
}: ICreateListProduct): Promise<number> => {
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
  listProductId: number | string,
  { listId, productId, quantity, price, active }: IUpdateListProduct,
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
      WHERE listProductId=?
    `,
      [listId, productId, quantity, price, active, listProductId],
    );

    const { affectedRows } = rows as ResultSetHeader;
    return affectedRows > 0;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};

const remove = async (listProductId: number | string): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      update
        list_products 
      set
        active=? 
      where
        listProductId=?
    `,
      [false, listProductId],
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
