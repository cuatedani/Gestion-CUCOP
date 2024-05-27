import express from "express";
import Product from "../../models/product";
import auth from "../../middlewares/auth";

const app = express();

app.get("/cucop/api/products", auth, async (req, res) => {
  const { sort = "desc", status } = req.query;

  const product = await Product.getAll({
    sort: sort as "desc" | "asc",
    status: status as "all" | "active" | "inactive",
  });
  res.status(200).send({ code: 200, product });
});

app.get("/cucop/api/products/:id", auth, async (req, res) => {
  const product = await Product.getById(req.params.id);
  res.status(200).send({ code: 200, product });
});

app.post("/cucop/api/products", auth, async (req, res) => {
  const cucopId = Number(req.body.id);
  const name = req.body.name;
  const description = req.body.description;
  const id = await Product.create({ cucopId, name, description, active: true });
  const code = id == -1 ? 400 : 200;
  res.status(code).send({ id });
});

app.put("/cucop/api/products/:id", auth, async (req, res) => {
  const updated = await Product.update(req.params.id, req.body);
  const code = updated ? 200 : 400;
  res.status(code).send({ code });
});

app.delete("/cucop/api/products/:id", auth, async (req, res) => {
  const updated = await Product.remove(req.params.id);
  const code = updated ? 200 : 400;
  res.status(code).send({ code });
});

export default app;