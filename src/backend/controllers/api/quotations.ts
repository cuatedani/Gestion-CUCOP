import express from "express";
import Quotation from "../../models/quotation";
import auth from "../../middlewares/auth";

const app = express();

app.get("/cucop/api/quotations", auth, async (req, res) => {
  const { sort = "desc", status } = req.query;

  const quotation = await Quotation.getAll({
    sort: sort as "desc" | "asc",
    status: status as "all" | "active" | "inactive",
  });
  res.status(200).send({ code: 200, quotation });
});

app.get("/cucop/api/quotations", auth, async (req, res) => {
  const quotation = await Quotation.getById(req.params.id);
  res.status(200).send({ code: 200, quotation });
});

app.post("/cucop/api/quotations", auth, async (req, res) => {
  const supplierId = Number(req.body.supplierId);
  const price = req.body.price;
  const description = req.body.description;
  const id = await Quotation.create({
    supplierId,
    price,
    description,
    active: true,
  });
  const code = id == -1 ? 400 : 200;
  res.status(code).send({ id });
});

app.put("/cucop/api/quotations/:id", auth, async (req, res) => {
  const updated = await Quotation.update(req.params.id, req.body);
  const code = updated ? 200 : 400;
  res.status(code).send({ code });
});

app.delete("/cucop/api/quotations/:id", auth, async (req, res) => {
  const updated = await Quotation.remove(req.params.id);
  const code = updated ? 200 : 400;
  res.status(code).send({ code });
});

export default app;
