import { ResultSetHeader, RowDataPacket } from "mysql2";

import db from "../database";
import OperationError from "../utils/error";

/**
 * Interfaces
 */

export interface ICucop {
  cucopId: number;
  clavecucopid: string;
  clavecucop: number;
  descripcion: string;
  unidaddemedida: string;
  tipodecontratacion: string;
  partidaespecifica: number;
  descpartidaespecifica: string;
  partidagenerica: number;
  descpartidagenerica: string;
  concepto: number;
  descconcepto: string;
  capitulo: number;
  desccapitulo: string;
  fechaalta: string;
  fechamodificacion: string;
  active: boolean;
}

export type ICreateCucop = Omit<ICucop, "cucopId" | "createdAt" | "updatedAt">;

export type IUpdateCucop = ICreateCucop;

interface IGetAllFilters {
  limit?: number;
  sort?: "asc" | "desc";
  status?: "all" | "active" | "inactive";
}

/**
 * Methods
 */

const exists = async (cucopId: number | boolean): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      select 
        cucopId
      from users
      where cucopId=?
    `,
      [cucopId],
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
}: IGetAllFilters): Promise<ICucop[]> => {
  try {
    const amount = limit ? `limit ${limit}` : "";
    const active = status != "all" ? `where active=${status == "active"}` : "";

    const [rows] = await db.query(`
      select 
        *
      from cucop ${active}
      order by createdAt ${sort} ${amount}
    `);

    const data = rows as ICucop[];
    return data;
  } catch (ex) {
    console.log(ex);
    return [];
  }
};

const getById = async (
  cucopId: number | string,
): Promise<ICucop | undefined> => {
  try {
    const [rows] = await db.query(
      `
      select 
        *
      from cucop
      where cucopId=?
    `,
      [cucopId],
    );

    const data = rows as RowDataPacket[];
    if (data.length == 0) throw new OperationError(400, "Not found");
    return data[0] as ICucop;
  } catch (ex) {
    console.log(ex);
    return undefined;
  }
};

const create = async ({
  clavecucopid,
  clavecucop,
  descripcion,
  unidaddemedida,
  tipodecontratacion,
  partidaespecifica,
  descpartidaespecifica,
  partidagenerica,
  descpartidagenerica,
  concepto,
  descconcepto,
  capitulo,
  desccapitulo,
  fechaalta,
  fechamodificacion,
  active,
}: ICreateCucop): Promise<number> => {
  try {
    const [rows] = await db.query(
      `
      insert into users (
        clavecucopid,
        clavecucop,
        descripcion,
        unidaddemedida,
        tipodecontratacion,
        partidaespecifica,
        descpartidaespecifica,
        partidagenerica,
        descpartidagenerica,
        concepto,
        descconcepto,
        capitulo,
        desccapitulo,
        fechaalta,
        fechamodificacion,
        active,
      ) values(?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        clavecucopid,
        clavecucop,
        descripcion,
        unidaddemedida,
        tipodecontratacion,
        partidaespecifica,
        descpartidaespecifica,
        partidagenerica,
        descpartidagenerica,
        concepto,
        descconcepto,
        capitulo,
        desccapitulo,
        fechaalta,
        fechamodificacion,
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
  cucopId: number | string,
  {
    clavecucopid,
    clavecucop,
    descripcion,
    unidaddemedida,
    tipodecontratacion,
    partidaespecifica,
    descpartidaespecifica,
    partidagenerica,
    descpartidagenerica,
    concepto,
    descconcepto,
    capitulo,
    desccapitulo,
    fechaalta,
    fechamodificacion,
    active,
  }: IUpdateCucop,
): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      UPDATE  
        cucop 
      SET 
        clavecucopid=?,
        clavecucop=?,
        descripcion=?,
        unidaddemedida=?,
        tipodecontratacion=?,
        partidaespecifica=?,
        descpartidaespecifica=?,
        partidagenerica=?,
        descpartidagenerica=?,
        concepto=?,
        descconcepto=?,
        capitulo=?,
        desccapitulo=?,
        fechaalta=?,
        fechamodificacion=?,
        active=?
      WHERE cucopId=?
    `,
      [
        clavecucopid,
        clavecucop,
        descripcion,
        unidaddemedida,
        tipodecontratacion,
        partidaespecifica,
        descpartidaespecifica,
        partidagenerica,
        descpartidagenerica,
        concepto,
        descconcepto,
        capitulo,
        desccapitulo,
        fechaalta,
        fechamodificacion,
        active,
        cucopId,
      ],
    );

    const { affectedRows } = rows as ResultSetHeader;
    return affectedRows > 0;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};

const remove = async (cucopId: number | string): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      update
        cucop 
      set
        active=? 
      where
        cucopId=?
    `,
      [false, cucopId],
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
