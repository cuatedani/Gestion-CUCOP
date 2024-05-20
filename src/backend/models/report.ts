import { RowDataPacket } from "mysql2";
import db from "../database";
import exceljs from "exceljs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { ICustomer } from "./customer";

interface IReportData {
  date: string;
  customerId: number;
  rol: string;
  institution: string;
  name: string;
  checkIn: string;
  checkOut: string;
  timeElapsed: number;
}

interface IGetReportDataFilters {
  startDate: string;
  endDate: string;
  customerId?: string;
}

export const getReportData = async ({
  startDate,
  endDate,
  customerId,
}: IGetReportDataFilters): Promise<IReportData[]> => {
  try {
    const customer = customerId ? `and customerId = ${customerId}` : "";
    const [rows] = await db.query<RowDataPacket[]>(
      `
      select
        *,
        ((case when tmp.checkOut is null or tmp.checkIn is null then 0 else timestampdiff(MINUTE, tmp.checkIn, tmp.checkOut) end) / 60) timeElapsed
      from (
        select 
          selected_date date,
          c.customerId,
          c.rol,
          c.institution,
          co.name,
          (
            select createdAt from checks where date(createdAt) = selected_date and type='check_in' and customerId = c.customerId order by createdAt asc limit 1
          ) checkIn,
          (
            select createdAt from checks where date(createdAt) = selected_date and type='check_out' and customerId = c.customerId order by createdAt asc limit 1
          ) checkOut
        from 
        (select adddate('1970-01-01',t4.i*10000 + t3.i*1000 + t2.i*100 + t1.i*10 + t0.i) selected_date from
        (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0,
        (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1,
        (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,
        (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3,
        (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v
        inner join customers c
        inner join contacts co
        on c.contactId = co.contactId
        where selected_date between ? and ? ${customer}
      ) tmp
    `,
      [startDate, endDate],
    );
    return rows as IReportData[];
  } catch (error) {
    return [];
  }
};

export const exportToExcel = async (
  data: IReportData[],
  customer?: ICustomer | null | undefined,
): Promise<string | null> => {
  try {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Reporte");

    const columns = [
      { header: "Fecha", key: "date", width: 12 },
      { header: "ID cliente", key: "customerId", width: 12 },
      { header: "Rol", key: "rol", width: 15 },
      { header: "Institución", key: "institution", width: 25 },
      { header: "Nombre", key: "name", width: 25 },
      { header: "Hora de entrada", key: "checkIn", width: 20 },
      { header: "Hora de salida", key: "checkOut", width: 20 },
      { header: "Diferencia de tiempo", key: "timeElapsed", width: 20 },
    ];

    worksheet.columns = columns;
    data.forEach((item: IReportData) => worksheet.addRow(item));

    if (customer) {
      const timeElapsed = data
        .map((x) => parseInt(x.timeElapsed.toString()))
        .reduce((a, b) => a + b);
      worksheet.addRow({
        date: "TOTAL",
        customerId: "",
        rol: "",
        institution: "",
        name: customer.targetHours,
        checkIn: -customer.adjustHours,
        checkOut: timeElapsed,
        timeElapsed: customer.targetHours - timeElapsed,
      });
    }

    const exportFileName = uuidv4();
    const exportPath = path.join(
      __dirname,
      `../../frontend/public/reports/${exportFileName}.xlsx`,
    );
    await workbook.xlsx.writeFile(exportPath);
    return exportFileName;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default {
  getReportData,
  exportToExcel,
};
