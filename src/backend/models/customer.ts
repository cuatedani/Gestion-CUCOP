import { ResultSetHeader, RowDataPacket } from "mysql2";

import db from "../database";
import OperationError from "../utils/error";
import { IContact } from "./contact";

/**
 * Interfaces
 */

export type ICustomerRol =
  | ""
  | "Investigador"
  | "Estudiante"
  | "Posdoctorante"
  | "Técnico"
  | "Otro";

export interface ICustomer {
  customerId: number;
  contactId: number;
  rol: string;
  institution: string;
  targetHours: number;
  adjustHours: number;
  hoursElapsed: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  contact: IContact;
}

export type ICreateCustomer = Omit<
  ICustomer,
  "customerId" | "createdAt" | "updatedAt" | "contact" | "name"
>;

export type IUpdateCustomer = ICreateCustomer;

export interface IGetAllFilters {
  limit?: number;
  reduced?: boolean;
  sort?: "asc" | "desc";
  status?: "all" | "active" | "inactive";
  customerId?: number;
  rol?: ICustomerRol;
  institution?: string;
  sortField?: string;
  name?: string;
}

/**
 * Methods
 */

const getAll = async ({
  limit,
  sort = "desc",
  customerId,
  rol,
  institution,
  name,
  status = "all",
}: IGetAllFilters): Promise<ICustomer[]> => {
  try {
    const amount = limit ? `limit ${limit}` : "";
    let where = "where customerId > 0";
    if (customerId) {
      where += ` and customerId = ${customerId}`;
    }
    if (rol) {
      where += ` and rol = '${rol}'`;
    }
    if (institution) {
      where += ` and institution = '${institution}'`;
    }
    if (name) {
      where += ` and name = '${name}'`;
    }
    if (status && status != "all") {
      where += ` and active = ${status == "active"}`;
    }
    const [rows] = await db.query(`
      select 
        *
      from customers_view
      ${where}
      order by customerId ${sort} ${amount} 
    `);
    const data = rows as ICustomer[];
    return data;
  } catch (ex) {
    console.log(ex);
    return [];
  }
};

const getById = async (
  customerId: number | string,
): Promise<ICustomer | undefined> => {
  try {
    const [rows] = await db.query(
      `
      select 
        *
      from customers_view
      where customerId=?
    `,
      [customerId],
    );

    const data = rows as RowDataPacket[];
    if (data.length == 0) throw new OperationError(404, "Not found");
    return data[0] as ICustomer;
  } catch (ex) {
    console.log(ex);
    return undefined;
  }
};

const create = async ({
  contactId,
  rol,
  institution,
  targetHours,
  adjustHours,
  active,
}: ICreateCustomer): Promise<number> => {
  try {
    const [rows] = await db.query(
      `
      insert into customers(
        contactId,
        rol,
        institution,
        targetHours,
        adjustHours,
        active
      ) 
      values(?, ?, ?, ?, ?, ?)
    `,
      [contactId, rol, institution, targetHours, adjustHours, active],
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
  customerId: number | string,
  {
    contactId,
    rol,
    institution,
    targetHours,
    adjustHours,
    active,
  }: IUpdateCustomer,
): Promise<boolean> => {
  const [rows] = await db.query(
    `
      update  
        customers 
      set 
        contactId=?,
        rol=?,
        institution=?,
        targetHours=?,
        adjustHours=?,
        active=?
      where customerId=?
    `,
    [contactId, rol, institution, targetHours, adjustHours, active, customerId],
  );

  const { affectedRows } = rows as ResultSetHeader;
  return affectedRows > 0;
};

const remove = async (customerId: number | string): Promise<boolean> => {
  const [rows] = await db.query(
    `
      update
        customers 
      set
        active=?
      where customerId=?
    `,
    [false, customerId],
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
