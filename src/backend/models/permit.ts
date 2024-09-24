import { ResultSetHeader } from "mysql2";
import db from "../database";

/**
 * Interfaces
 */

export interface IPermit {
  permitId: number;
  partidagenerica: number;
}

export type ICreatePermit = Omit<IPermit, "permitId">;

export type IUpdatePermit = ICreatePermit;

/**
 * Methods
 */

const getAll = async (): Promise<IPermit[]> => {
  try {
    const [rows] = await db.query(`
      SELECT 
        permitId,
        partidagenerica
      FROM PERMITS;
    `);

    const data = rows as IPermit[];
    return data;
  } catch (ex) {
    console.log(ex);
    return [];
  }
};

const create = async ({ partidagenerica }: ICreatePermit): Promise<number> => {
  try {
    if (!partidagenerica) {
      return -1;
    }
    const [rows] = await db.query(
      `
      insert into PERMITS (
        partidagenerica
      ) values(?)
    `,
      [partidagenerica],
    );
    const { insertId } = rows as ResultSetHeader;
    return insertId as number;
  } catch (ex) {
    console.log(ex);
    return -1;
  }
};

const update = async (
  permitId: number | string,
  { partidagenerica }: IUpdatePermit,
): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      UPDATE  
        PERMITS 
      SET 
        partidagenerica=?
      WHERE permitId=?
    `,
      [partidagenerica, permitId],
    );

    const { affectedRows } = rows as ResultSetHeader;
    return affectedRows > 0;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};

const remove = async (permitId: number | string): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      DELETE
      FROM PERMITS  
      where
        permitId=?
    `,
      [permitId],
    );

    const { affectedRows } = rows as ResultSetHeader;
    return affectedRows > 0;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};

export default {
  getAll,
  create,
  update,
  remove,
};
