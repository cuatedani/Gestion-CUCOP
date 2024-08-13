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

const getRegCapitulos = async (capitulo: string): Promise<ICucop[]> => {
  try {
    const [rows] = await db.query(
      `
      SELECT *
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

const getRegConceptos = async (concepto: string): Promise<ICucop[]> => {
  try {
    const [rows] = await db.query(
      `
      SELECT *
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

const getRegGenericas = async (generica: string): Promise<ICucop[]> => {
  try {
    const [rows] = await db.query(
      `
      SELECT * 
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

const getRegEspecificas = async (especifica: string): Promise<ICucop[]> => {
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
  const logs = [];
  let ecount = 0;
  try {
    logs.push({
      time: new Date().toISOString(),
      type: "info",
      message: "Archivo recibido correctamente",
    });

    const content = fileBuffer.toString("utf-8");
    const lines = content.split("\n");
    let c = 1;

    for (const line of lines.slice(1)) {
      logs.push({
        time: new Date().toISOString(),
        type: "info",
        message: `Procesado fila #${c}`,
      });

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

      let cid = 0;
      let upd = false;

      // Buscar si existe el registro
      const clv = await existsclv(clavecucop);

      // Si existe actualizar sino agregar
      if (clv) {
        upd = await update(clv, {
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
        if (upd) {
          logs.push({
            time: new Date().toISOString(),
            type: "success",
            message: `Fila #${c}: Registro actualizado correctamente`,
          });
        } else {
          logs.push({
            time: new Date().toISOString(),
            type: "error",
            message: `Fila #${c}: Error al actualizar registro`,
          });
          ecount++;
          c++;
          continue;
        }
      } else {
        cid = await create({
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
        if (cid) {
          logs.push({
            time: new Date().toISOString(),
            type: "success",
            message: `Fila #${c}: Registro agregado correctamente `,
          });
        } else {
          logs.push({
            time: new Date().toISOString(),
            type: "error",
            message: `Fila #${c}: Error al agregar registro`,
          });
          c++;
          ecount++;
          continue;
        }
      }
      c++;
    }
    logs.push({
      time: new Date().toISOString(),
      type: "info",
      message: `Procesado Finalizado`,
    });
    if (ecount > 0) {
      logs.push({
        time: new Date().toISOString(),
        type: "error",
        message: `Se encontraron ${ecount} errores `,
      });
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
  existsclv,
  getDefalt,
  getAll,
  getById,
  getCapitulos,
  getRegCapitulos,
  getConceptos,
  getRegConceptos,
  getGenericas,
  getRegGenericas,
  getEspecificas,
  getRegEspecificas,
  create,
  load,
  update,
  remove,
};
