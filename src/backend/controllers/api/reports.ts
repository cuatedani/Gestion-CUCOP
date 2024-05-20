import express, { Request, Response } from "express";
import Report from "../../models/report";
import OperationError from "../../utils/error";
import Customer from "../../models/customer";

const app = express();

app.use(express.json());

app.get("/time/api/reports", async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, customerId } = req.query;

    const reportData = await Report.getReportData({
      startDate: startDate as string,
      endDate: endDate as string,
      customerId: customerId as string,
    });

    if (reportData.length === 0) {
      res
        .status(404)
        .send("No se encontraron datos para las fechas especificadas.");
      return;
    }
    let customer = null;
    if (customerId) customer = await Customer.getById(customerId as string);
    const fileName = await Report.exportToExcel(reportData, customer);

    if (!fileName)
      throw new OperationError(400, "Error al generar el archivo de Excel.");

    res.status(200).json({ fileName });
  } catch (error) {
    console.error("Error al obtener los datos o exportar el archivo:", error);
    res.status(500).send("Error al obtener los datos o exportar el archivo.");
  }
});

export default app;
