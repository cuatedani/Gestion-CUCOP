import { ResultSetHeader, RowDataPacket } from "mysql2";

import db from "../database";
import OperationError from "../utils/error";
import Log, { ILog } from "./log";

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

const existsClave = async (clavecucop: number | string): Promise<number> => {
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

const getDefalt = async (): Promise<number> => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        cucopId
      FROM cucop
    `,
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

const getAll = async ({
  partidaespecifica,
  partidagenerica,
  concepto,
  capitulo,
}: {
  partidaespecifica?: number;
  partidagenerica?: number;
  concepto?: number;
  capitulo?: number;
}): Promise<ICucop[]> => {
  try {
    let query = "SELECT * FROM cucop WHERE 1=1";
    const queryParams: number[] = [];

    if (partidaespecifica) {
      query += " AND partidaespecifica = ?";
      queryParams.push(Number(partidaespecifica));
    }
    if (partidagenerica) {
      query += " AND partidagenerica = ?";
      queryParams.push(Number(partidagenerica));
    }
    if (concepto) {
      query += " AND concepto = ?";
      queryParams.push(Number(concepto));
    }
    if (capitulo) {
      query += " AND capitulo = ?";
      queryParams.push(Number(capitulo));
    }
    const [rows] = await db.query(query, queryParams);
    const data = rows as ICucop[];
    return data;
  } catch (ex) {
    console.log(ex);
    return [];
  }
};

const getChapters = async (): Promise<ICucop[]> => {
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

const getConcepts = async (capitulo: string): Promise<ICucop[]> => {
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

const getGenerics = async (concepto: string): Promise<ICucop[]> => {
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

const getSpecifics = async (generica: string): Promise<ICucop[]> => {
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

const parseCSVLine = (line: string): string[] => {
  const fields: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      fields.push(field.trim());
      field = "";
    } else {
      field += char;
    }
  }

  fields.push(field.trim());

  return fields;
};

const load = async (fileBuffer: Buffer) => {
  const logs: ILog[] = [];
  let ecount = 0;
  try {
    console.log("Archivo recibido correctamente");
    logs.push(Log.createLog("info", "Archivo recibido correctamente"));

    const content = fileBuffer.toString("utf-8");
    const lines = content.split("\n");
    let c = 1;

    for (const line of lines.slice(1)) {
      logs.push(Log.createLog("info", `Procesado fila #${c}`));

      const [
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
      ] = parseCSVLine(line);

      let cucopId = null;
      let updated = false;

      // Buscar si existe el registro
      const clave = await existsClave(clavecucop);

      // Si existe actualizar sino agregar
      if (clave != 0) {
        updated = await update(clave, {
          clavecucop: Number(clavecucop),
          descripcion: descripcion,
          unidaddemedida: unidaddemedida,
          tipodecontratacion: tipodecontratacion,
          partidaespecifica: Number(partidaespecifica),
          descpartidaespecifica: descpartidaespecifica,
          partidagenerica: Number(partidagenerica),
          descpartidagenerica: descpartidagenerica,
          concepto: Number(concepto),
          descconcepto: descconcepto,
          capitulo: Number(capitulo),
          desccapitulo: desccapitulo,
        });
        if (updated) {
          logs.push(
            Log.createLog(
              "success",
              `Fila #${c}: Registro actualizado correctamente`,
            ),
          );
        } else {
          logs.push(
            Log.createLog("error", `Fila #${c}: Error al actualizar registro`),
          );
          ecount++;
          c++;
          continue;
        }
      } else {
        cucopId = await create({
          clavecucop: Number(clavecucop),
          descripcion: descripcion,
          unidaddemedida: unidaddemedida,
          tipodecontratacion: tipodecontratacion,
          partidaespecifica: Number(partidaespecifica),
          descpartidaespecifica: descpartidaespecifica,
          partidagenerica: Number(partidagenerica),
          descpartidagenerica: descpartidagenerica,
          concepto: Number(concepto),
          descconcepto: descconcepto,
          capitulo: Number(capitulo),
          desccapitulo: desccapitulo,
        });
        if (cucopId) {
          logs.push(
            Log.createLog(
              "success",
              `Fila #${c}: Registro agregado correctamente`,
            ),
          );
        } else {
          logs.push(
            Log.createLog("error", `Fila #${c}: Error al agregar registro`),
          );
          c++;
          ecount++;
          continue;
        }
      }
      c++;
    }
    logs.push(Log.createLog("info", `Procesado Finalizado`));
    if (ecount > 0) {
      logs.push(Log.createLog("error", `Se encontraron ${ecount} errores`));
    }
  } catch (ex) {
    console.log(ex);
    return `Error al procesar el Archivo: ${ex}`;
  }
  return logs;
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
  existsClave,
  getDefalt,
  getAll,
  getById,
  getChapters,
  getConcepts,
  getGenerics,
  getSpecifics,
  create,
  load,
  update,
  remove,
};
