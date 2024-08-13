import express from "express";
import QuotProduct from "../../models/quotation_product";
import auth from "../../middlewares/auth";

const app = express();
app.get("/cucop/api/quotationProducts", auth, async (req, res) => {
  const quotproducts = await QuotProduct.getAll(req.query);
  res.status(200).send({ code: 200, quotproducts });
});

app.get("/cucop/api/quotationProducts/:id", auth, async (req, res) => {
  const quotproduct = await QuotProduct.getById(req.params.id);
  res.status(200).send({ code: 200, quotproduct });
});

app.post("/cucop/api/quotationProducts/", auth, async (req, res) => {
  const created = await QuotProduct.create(req.body);
  const code = created == -1 ? 400 : 200;
  res.status(code).send({ created });
});

app.put("/cucop/api/quotationProducts/:id", auth, async (req, res) => {
  const updated = await QuotProduct.update(req.params.id, req.body);
  const code = updated ? 200 : 400;
  res.status(code).send({ code });
});

app.delete("/cucop/api/quotationProducts/:id", auth, async (req, res) => {
  const deleted = await QuotProduct.remove(req.params.id);
  const code = deleted ? 200 : 400;
  res.status(code).send({ code });
});

export default app;
