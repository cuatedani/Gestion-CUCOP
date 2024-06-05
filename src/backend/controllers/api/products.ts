import express from "express";
import Product from "../../models/product";
import auth from "../../middlewares/auth";

const app = express();

app.get("/cucop/api/products", auth, async (req, res) => {
  const { sort = "desc", status } = req.query;

  const products = await Product.getAll({
    sort: sort as "desc" | "asc",
    status: status as "all" | "active" | "inactive",
  });
  res.status(200).send({ code: 200, products });
});

app.get("/cucop/api/products/:id", auth, async (req, res) => {
  const product = await Product.getById(req.params.id);
  res.status(200).send({ code: 200, product });
});

app.post("/cucop/api/products", auth, async (req, res) => {
  const id = await Product.create(req.body);
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
