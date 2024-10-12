import { ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../database";
import OperationError from "../utils/error";

/**
 * Interfaces
 */

export interface IMedia {
  mediaId: number;
  objectId: number;
  name: string;
  extension: string;
  category: string;
  url: string;
  rol: string;
  owner: string;
  createdAt: string;
}

export type ICreateMedia = Omit<IMedia, "mediaId" | "createdAt">;

export type IUpdateMedia = ICreateMedia;

interface IGetAllFilters {
  limit?: number;
  sort?: "asc" | "desc";
}

/**
 * Methods
 */

const getAll = async ({
  limit,
  sort = "desc",
}: IGetAllFilters): Promise<IMedia[]> => {
  const amount = limit ? `limit ${limit}` : "";
  const [rows] = await db.query(
    `
      select 
        mediaId,
        objectId,
        name,
        extension,
        category,
        url,
        rol,
        owner,
        createdAt
      from medias
      order by createdAt ${sort} ${amount}
    `,
  );

  const data = rows as IMedia[];
  return data;
};

const getById = async (mediaId: number): Promise<IMedia | undefined> => {
  try {
    const [rows] = await db.query(
      `
      select 
        mediaId,
        objectId,
        name,
        extension,
        category,
        url,
        rol,
        owner,
        createdAt
      from medias
      where mediaId=?
    `,
      [mediaId],
    );

    const data = rows as RowDataPacket[];
    if (data.length == 0) throw new OperationError(400, "Not found");
    return data[0] as IMedia;
  } catch (ex) {
    console.log(ex);
    return undefined;
  }
};

const getByObjectId = async (
  objectId: number,
  category: string,
  rol = "main",
): Promise<IMedia[] | undefined> => {
  try {
    const [rows] = await db.query(
      `
      select 
        mediaId,
        objectId,
        name,
        extension,
        category,
        url,
        rol,
        owner,
        createdAt
      from medias
      where 
        objectId=? and category=? and rol=?
      order by createdAt desc
    `,
      [objectId, category, rol],
    );

    const data = rows as RowDataPacket[];
    if (data.length == 0) throw new OperationError(400, "Not found");
    return data as IMedia[];
  } catch (ex) {
    console.log(ex);
    return [];
  }
};

const getFile = async (mediaId: number): Promise<IMedia | undefined> => {
  try {
    const [rows] = await db.query(
      `
      select 
        mediaId,
        objectId,
        name,
        extension,
        category,
        url,
        rol,
        owner,
        createdAt
      from medias
      where 
        mediaId=?
      order by createdAt desc
    `,
      [mediaId],
    );

    const data = rows as RowDataPacket[];
    return data[0] as IMedia;
  } catch (ex) {
    console.log(ex);
    return undefined;
  }
};

const create = async ({
  objectId,
  name,
  extension,
  category,
  url,
  rol,
  owner,
}: ICreateMedia): Promise<number> => {
  try {
    const [rows] = await db.query(
      `
      insert into medias(
        objectId,
        name,
        extension,
        category,
        url,
        rol,
        owner
      ) values (?, ?, ?, ?, ?, ?, ?)
    `,
      [objectId, name, extension, category, url, rol, owner],
    );

    const { insertId } = rows as ResultSetHeader;
    if (insertId == 0) throw new OperationError(400, "Error creating");
    return insertId as number;
  } catch (ex) {
    console.log(ex);
    return -1;
  }
};

const update = async (
  mediaId: number | string,
  { objectId, name, extension, category, url, rol, owner }: IUpdateMedia,
): Promise<boolean> => {
  const [rows] = await db.query(
    `
      update  
        medias 
      set 
        objectId=?,
        name=?,
        extension=?,
        category=?,
        url=?,
        rol=?,
        owner=?
      where mediaId=?
    `,
    [objectId, name, extension, category, url, rol, owner, mediaId],
  );

  const { affectedRows } = rows as ResultSetHeader;
  return affectedRows > 0;
};

const remove = async (mediaId: number | string): Promise<boolean> => {
  const [rows] = await db.query(
    `
      delete from medias where mediaId=?
    `,
    [mediaId],
  );

  const { affectedRows } = rows as ResultSetHeader;
  return affectedRows > 0;
};

export default {
  getAll,
  getById,
  getByObjectId,
  getFile,
  create,
  update,
  remove,
};
