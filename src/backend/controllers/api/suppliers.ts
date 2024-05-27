import express from "express";
import Supplier from "../../models/supplier";
import auth from "../../middlewares/auth";

const app = express();

app.get("/cucop/api/suppliers", auth, async (req, res) => {
  const { sort = "desc", status } = req.query;

  const supplier = await Supplier.getAll({
    sort: sort as "desc" | "asc",
    status: status as "all" | "active" | "inactive",
  });
  res.status(200).send({ code: 200, supplier });
});

app.get("/cucop/api/suppliers/:id", auth, async (req, res) => {
  const supplier = await Supplier.getById(req.params.id);
  res.status(200).send({ code: 200, supplier });
});

app.post("/cucop/api/suppliers/", auth, async (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const tin = req.body.tin;
  const phone = req.body.phone;
  const address = req.body.address;
  const id = await Supplier.create({
    name,
    description,
    tin,
    phone,
    address,
    active: true,
  });
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
