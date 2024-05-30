import express from "express";
import ListProduct from "../../models/list_product";
import auth from "../../middlewares/auth";

const app = express();

app.get("/cucop/api/list-products", auth, async (req, res) => {
  const { sort = "desc", status } = req.query;

  const listproduct = await ListProduct.getAll({
    sort: sort as "desc" | "asc",
    status: status as "all" | "active" | "inactive",
  });
  res.status(200).send({ code: 200, listproduct });
});

app.get("/cucop/api/list-products/:id", auth, async (req, res) => {
  const listproduct = await ListProduct.getById(req.params.id);
  res.status(200).send({ code: 200, listproduct });
});

app.post("/cucop/api/list-products/", auth, async (req, res) => {
  const id = await ListProduct.create(req.body);
  const code = id == -1 ? 400 : 200;
  res.status(code).send({ id });
});

app.put("/cucop/api/list-products/:id", auth, async (req, res) => {
  const updated = await ListProduct.update(req.params.id, req.body);
  const code = updated ? 200 : 400;
  res.status(code).send({ code });
});

app.delete("/cucop/api/list-products/:id", auth, async (req, res) => {
  const updated = await ListProduct.remove(req.params.id);
  const code = updated ? 200 : 400;
  res.status(code).send({ code });
});

export default app;
