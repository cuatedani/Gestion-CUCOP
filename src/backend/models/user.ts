import { ResultSetHeader, RowDataPacket } from "mysql2";

import db from "../database";
import OperationError from "../utils/error";

/**
 * Interfaces
 */
import crypto from "crypto";

export interface IUser {
  userId: number;
  firstNames: string;
  lastNames: string;
  email: string;
  password: string;
  rol: string;
  active: boolean;
  updatedAt: string;
  createdAt: string;
}

export type ICreateUser = Omit<IUser, "userId" | "createdAt" | "updatedAt">;

export type IUpdateUser = ICreateUser;

interface IGetAllFilters {
  limit?: number;
  sort?: "asc" | "desc";
  status?: "all" | "active" | "inactive";
}

/**
 * Methods
 */

const exists = async (userId: number | boolean): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      select 
        userId
      from users
      where userId=?
    `,
      [userId],
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
}: IGetAllFilters): Promise<IUser[]> => {
  try {
    const amount = limit ? `limit ${limit}` : "";
    const active = status != "all" ? `where active=${status == "active"}` : "";

    const [rows] = await db.query(`
      select 
        *
      from users ${active}
      order by createdAt ${sort} ${amount}
    `);

    const data = rows as IUser[];
    return data;
  } catch (ex) {
    console.log(ex);
    return [];
  }
};

const getById = async (userId: number | string): Promise<IUser | undefined> => {
  try {
    const [rows] = await db.query(
      `
      select 
        *
      from users
      where userId=?
    `,
      [userId],
    );

    const data = rows as RowDataPacket[];
    if (data.length == 0) throw new OperationError(400, "Not found");
    return data[0] as IUser;
  } catch (ex) {
    console.log(ex);
    return undefined;
  }
};

const getPublicById = async (
  userId: number | string,
): Promise<IUser | undefined> => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        userId,
        firstNames,
        lastNames
      from users
      where userId=?
    `,
      [userId],
    );

    const data = rows as RowDataPacket[];
    if (data.length == 0) throw new OperationError(400, "Not found");
    return data[0] as IUser;
  } catch (ex) {
    console.log(ex);
    return undefined;
  }
};

const create = async ({
  firstNames,
  lastNames,
  email,
  password,
  rol,
  active,
}: ICreateUser): Promise<number> => {
  try {
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const [rows] = await db.query(
      `
      insert into users (
        firstNames,
        lastNames,
        email,
        password,
        rol,
        active
      ) values(?, ?, ?, ?, ?, ?)
    `,
      [firstNames, lastNames, email, hashedPassword, rol, active],
    );

    const { insertId } = rows as ResultSetHeader;
    return insertId as number;
  } catch (ex) {
    console.log(ex);
    return -1;
  }
};

const update = async (
  userId: number | string,
  { firstNames, lastNames, email, password, rol, active }: IUpdateUser,
): Promise<boolean> => {
  try {
    const user = await getById(userId);

    let hashedPassword = user?.password;

    if (password) {
      hashedPassword = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");
    }

    const [rows] = await db.query(
      `
      UPDATE  
        users 
      SET 
        firstNames=?,
        lastNames=?,
        email=?,
        password=?,
        rol=?,
        active=?
      WHERE userId=?
    `,
      [firstNames, lastNames, email, hashedPassword, rol, active, userId],
    );

    const { affectedRows } = rows as ResultSetHeader;
    return affectedRows > 0;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};

const remove = async (userId: number | string): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      update
        users 
      set
        active=? 
      where
        userId=?
    `,
      [false, userId],
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
  getPublicById,
  create,
  update,
  remove,
};
