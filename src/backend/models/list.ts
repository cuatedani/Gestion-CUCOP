import { ResultSetHeader, RowDataPacket } from "mysql2";

import db from "../database";
import OperationError from "../utils/error";

/**
 * Interfaces
 */

export interface IList {
  listId: number;
  userId: number;
  status: string;
  active: boolean;
  updatedAt: string;
  createdAt: string;
}

export type ICreateList = Omit<IList, "listId" | "createdAt" | "updatedAt">;

export type IUpdateList = ICreateList;

interface IGetAllFilters {
  limit?: number;
  sort?: "asc" | "desc";
  status?: "all" | "active" | "inactive";
}

/**
 * Methods
 */

const exists = async (listId: number | boolean): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      select 
        listId
      from users
      where listId=?
    `,
      [listId],
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
}: IGetAllFilters): Promise<IList[]> => {
  try {
    const amount = limit ? `limit ${limit}` : "";
    const active = status != "all" ? `where active=${status == "active"}` : "";

    const [rows] = await db.query(`
      select 
        *
      from lists ${active}
      order by createdAt ${sort} ${amount}
    `);

    const data = rows as IList[];
    return data;
  } catch (ex) {
    console.log(ex);
    return [];
  }
};

const getById = async (listId: number | string): Promise<IList | undefined> => {
  try {
    const [rows] = await db.query(
      `
      select 
        *
      from lists
      where listId=?
    `,
      [listId],
    );

    const data = rows as RowDataPacket[];
    if (data.length == 0) throw new OperationError(400, "Not found");
    return data[0] as IList;
  } catch (ex) {
    console.log(ex);
    return undefined;
  }
};

const create = async ({
  userId,
  status,
  active,
}: ICreateList): Promise<number> => {
  try {
    const [rows] = await db.query(
      `
      insert into lists (
        userId,
        status,
        active
      ) values(?, ?, ?)
    `,
      [userId, status, active],
    );

    const { insertId } = rows as ResultSetHeader;
    return insertId as number;
  } catch (ex) {
    console.log(ex);
    return -1;
  }
};

const update = async (
  listId: number | string,
  { userId, status, active }: IUpdateList,
): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      UPDATE  
        lists 
      SET 
        userId=?,
        status=?,
        active=?
      WHERE listId=?
    `,
      [userId, status, active, listId],
    );

    const { affectedRows } = rows as ResultSetHeader;
    return affectedRows > 0;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};

const remove = async (listId: number | string): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      update
        lists 
      set
        active=? 
      where
        listId=?
    `,
      [false, listId],
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
