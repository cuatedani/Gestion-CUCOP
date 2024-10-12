import express from "express";
import Supplier from "../../models/supplier";
import auth from "../../middlewares/auth";

const app = express();

app.get("/holass", async (req, res) => {
  return res.status(200).send("hola mundo");
});

app.get("/cucop/api/suppliers", auth, async (req, res) => {
  const { sort = "desc", status } = req.query;
  const suppliers = await Supplier.getAll({
    sort: sort as "desc" | "asc",
    status: status as "all" | "active" | "inactive",
  });
  res.status(200).send({ code: 200, suppliers });
});

app.get("/cucop/api/suppliers/:id", auth, async (req, res) => {
  const supplier = await Supplier.getById(req.params.id);
  res.status(200).send({ code: 200, supplier });
});

app.post("/cucop/api/suppliers/", auth, async (req, res) => {
  const id = await Supplier.create(req.body);
  const code = id == -1 ? 400 : 200;
  res.status(code).send({ id });
});

app.put("/cucop/api/suppliers/:id", auth, async (req, res) => {
  const updated = await Supplier.update(req.params.id, req.body);
  const code = updated ? 200 : 400;
  res.status(code).send({ code });
});

app.delete("/cucop/api/suppliers/:id", auth, async (req, res) => {
  const updated = await Supplier.remove(req.params.id);
  const code = updated ? 200 : 400;
  res.status(code).send({ code });
});

export default app;
