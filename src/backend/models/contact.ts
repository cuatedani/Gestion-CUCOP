import { ResultSetHeader, RowDataPacket } from "mysql2";

import db from "../database";
import OperationError from "../utils/error";

/**
 * Interfaces
 */

export interface IContact {
  contactId: number;
  name: string;
  country: string;
  state: string;
  municipality: string;
  suburb: string;
  street: string;
  cardinalPoint: string;
  number: string;
  cp: string;
  phone1: string;
  phone2: string;
  email1: string;
  email2: string;
  web: string;
  type: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ICreateContact = Omit<
  IContact,
  "contactId" | "createdAt" | "updatedAt"
>;

export type IUpdateContact = ICreateContact;

export interface IGetAllFilters {
  limit?: number;
  sort?: "asc" | "desc";
  status?: "all" | "active" | "inactive";
}
/**
 * Methods
 */

const getAll = async ({
  limit,
  sort = "desc",
  status = "all",
}: IGetAllFilters): Promise<IContact[]> => {
  try {
    const amount = limit ? `limit ${limit}` : "";
    const where = status != "all" ? `where active=${status == "active"}` : "";
    const [rows] = await db.query(`
      select 
        *
      from contacts
      ${where}
      order by contactId ${sort} ${amount} 
    `);

    const data = rows as IContact[];
    return data;
  } catch (ex) {
    console.log(ex);
    return [];
  }
};

const getById = async (
  contactId: number | string,
): Promise<IContact | undefined> => {
  try {
    const [rows] = await db.query(
      `
      select 
        *
      from contacts
      where contactId=?
    `,
      [contactId],
    );

    const data = rows as RowDataPacket[];
    if (data.length == 0) throw new OperationError(404, "Not found");
    return data[0] as IContact;
  } catch (ex) {
    console.log(ex);
    return undefined;
  }
};

const create = async ({
  name,
  country,
  state,
  municipality,
  suburb,
  street,
  cardinalPoint,
  number,
  cp,
  phone1,
  phone2,
  email1,
  email2,
  web,
  type,
  active,
}: ICreateContact): Promise<number> => {
  try {
    const [rows] = await db.query(
      `
      insert into contacts (
        name,
        country,
        state,
        municipality,
        suburb,
        street,
        cardinalPoint,
        number,
        cp,
        phone1,
        phone2,
        email1,
        email2,
        web,
        type,
        active
      ) 
      values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        name,
        country,
        state,
        municipality,
        suburb,
        street,
        cardinalPoint,
        number,
        cp,
        phone1,
        phone2,
        email1,
        email2,
        web,
        type,
        active,
      ],
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
  contactId: number | string,
  {
    name,
    country,
    state,
    municipality,
    suburb,
    street,
    cardinalPoint,
    number,
    cp,
    phone1,
    phone2,
    email1,
    email2,
    web,
    type,
    active,
  }: IUpdateContact,
): Promise<boolean> => {
  const [rows] = await db.query(
    `
    update  
      contacts
    set 
      name=?,
      country=?,
      state=?,
      municipality=?,
      suburb=?,
      street=?,
      cardinalPoint=?,
      number=?,
      cp=?,
      phone1=?,
      phone2=?,
      email1=?,
      email2=?,
      web=?,
      type=?,
      active=?
    where 
      contactId=?
    `,
    [
      name,
      country,
      state,
      municipality,
      suburb,
      street,
      cardinalPoint,
      number,
      cp,
      phone1,
      phone2,
      email1,
      email2,
      web,
      type,
      active,
      contactId,
    ],
  );

  const { affectedRows } = rows as ResultSetHeader;
  return affectedRows > 0;
};

const remove = async (contactId: number | string): Promise<boolean> => {
  const [rows] = await db.query(
    `
      update 
        contacts
      set 
        active=?
      where 
        contactId=? 
    `,
    [false, contactId],
  );

  const { affectedRows } = rows as ResultSetHeader;
  return affectedRows > 0;
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
};
