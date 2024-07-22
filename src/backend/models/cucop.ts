import { ResultSetHeader, RowDataPacket } from "mysql2";

import db from "../database";
import OperationError from "../utils/error";

/**
 * Interfaces
 */

export interface ICucop {
  cucopId: number;
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
}

export type ICreateCucop = Omit<ICucop, "cucopId">;

export type IUpdateCucop = ICreateCucop;

/**
 * Methods
 */

const exists = async (cucopId: number | boolean): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      select 
        cucopId
      from cucop
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

const existsclv = async (clavecucop: number | string): Promise<number> => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        cucopId
      FROM cucop
      WHERE clavecucop = ?
    `,
      [clavecucop],
    );

    const data = rows as RowDataPacket[];
    if (data.length === 0) {
      return 0;
    }

    return data[0].cucopId as number;
  } catch (ex) {
    console.log(ex);
    return 0;
  }
};

const getAll = async (): Promise<ICucop[]> => {
  try {
    const [rows] = await db.query(`
      select 
        *
      from cucop
    `);

    const data = rows as ICucop[];
    return data;
  } catch (ex) {
    console.log(ex);
    return [];
  }
};

const getCapitulos = async (): Promise<ICucop[]> => {
  try {
    const [rows] = await db.query(`
      SELECT DISTINCT 
      desccapitulo, capitulo 
      FROM CUCOP;
    `);

    const data = rows as ICucop[];
    return data;
  } catch (ex) {
    console.log(ex);
    return [];
  }
};

const getConceptos = async (capitulo: string): Promise<ICucop[]> => {
  try {
    const [rows] = await db.query(
      `
      SELECT DISTINCT 
      descconcepto, concepto 
      FROM CUCOP
      WHERE capitulo=?
    `,
      [Number(capitulo)],
    );

    const data = rows as ICucop[];
    return data;
  } catch (ex) {
    console.log(ex);
    return [];
  }
};

const getGenericas = async (concepto: string): Promise<ICucop[]> => {
  try {
    const [rows] = await db.query(
      `
      SELECT DISTINCT 
      descpartidagenerica, partidagenerica 
      FROM CUCOP
      WHERE concepto=?;
    `,
      [Number(concepto)],
    );

    const data = rows as ICucop[];
    return data;
  } catch (ex) {
    console.log(ex);
    return [];
  }
};

const getEspecificas = async (generica: string): Promise<ICucop[]> => {
  try {
    const [rows] = await db.query(
      `
      SELECT DISTINCT 
      descpartidaespecifica, partidaespecifica 
      FROM CUCOP
      WHERE partidagenerica=?;
    `,
      [Number(generica)],
    );

    const data = rows as ICucop[];
    return data;
  } catch (ex) {
    console.log(ex);
    return [];
  }
};

const getRegistros = async (especifica: string): Promise<ICucop[]> => {
  try {
    const [rows] = await db.query(
      `
      SELECT * FROM CUCOP
      WHERE partidaespecifica=?;
    `,
      [Number(especifica)],
    );

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
}: ICreateCucop): Promise<number> => {
  try {
    const [rows] = await db.query(
      `
      insert into cucop (
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
        desccapitulo
      ) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
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
  }: IUpdateCucop,
): Promise<boolean> => {
  try {
    const [rows] = await db.query(
      `
      UPDATE  
        cucop 
      SET 
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
        desccapitulo=?
      WHERE cucopId=?
    `,
      [
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
      DELETE
      FROM cucop  
      where
        cucopId=?
    `,
      [cucopId],
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
  existsclv,
  getAll,
  getById,
  getCapitulos,
  getConceptos,
  getGenericas,
  getEspecificas,
  getRegistros,
  create,
  update,
  remove,
};
