import { ResultSetHeader, RowDataPacket } from "mysql2";

import db from "../database";
import OperationError from "../utils/error";
import Cucop, { ICucop } from "./cucop";

/**
 * Interfaces
 */

export interface IProduct {
  productId: number;
  cucopId: number;
  name: string;
  description: string;
  brand: string;
  model: string;
  denomination: string;
  serialNumber: string;
  itemNumber: string;
  active: boolean;
  updatedAt: string;
  createdAt: string;
  cucop?: ICucop;
}

export type ICreateProduct = Omit<
  IProduct,
  "productId" | "createdAt" | "updatedAt" | "cucop"
>;

export type IUpdateProduct = ICreateProduct;

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

const getAll = async (): Promise<IProduct[]> => {
  try {
    const [rows] = await db.query(`
      select 
        *
      from products
      order by createdAt
    `);

    const data = rows as IProduct[];
    await Promise.all(
      data.map(async (prod) => {
        const procuc = await Cucop.getById(prod.cucopId);
        prod.cucop = procuc;
      }),
    );
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
    const prod = data[0] as IProduct;
    prod.cucop = await Cucop.getById(prod.cucopId);
    return prod;
  } catch (ex) {
    console.log(ex);
    return undefined;
  }
};

const existsName = async (name: string): Promise<number> => {
  try {
    const [rows] = await db.query(
      `
      select 
        *
      from products
      where name=? && active=1
    `,
      [name],
    );

    const data = rows as RowDataPacket[];
    if (data.length === 0) {
      return 0;
    }

    return data[0].productId as number;
  } catch (ex) {
    console.log(ex);
    return 0;
  }
};

const create = async ({
  cucopId,
  name,
  description,
  brand,
  model,
  denomination,
  serialNumber,
  itemNumber,
  active,
}: ICreateProduct): Promise<number> => {
  try {
    const [rows] = await db.query(
      `
      insert into products (
        cucopId,
        name,
        description,
        brand,
        model,
        denomination,
        serialNumber,
        itemNumber,
        active
      ) values(?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        cucopId,
        name,
        description,
        brand,
        model,
        denomination,
        serialNumber ? serialNumber : "S/N",
        itemNumber ? itemNumber : "S/N",
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

const update = async (
  productId: number | string,
  {
    cucopId,
    name,
    description,
    brand,
    model,
    denomination,
    serialNumber,
    itemNumber,
    active,
  }: IUpdateProduct,
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
        brand=?,
        model=?,
        denomination=?,
        serialNumber=?,
        itemNumber=?,
        active=?
      WHERE productId=?
    `,
      [
        cucopId,
        name,
        description,
        brand,
        model,
        denomination,
        serialNumber ?? "S/N",
        itemNumber ?? "S/N",
        active,
        productId,
      ],
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
  existsName,
  getAll,
  getById,
  create,
  update,
  remove,
};
