import express from "express";
import multer from "multer";
import QuotProduct from "../../models/quot_product";
import auth from "../../middlewares/auth";

const app = express();
const upload = multer();

app.get("/cucop/api/quot-products", auth, async (req, res) => {
  const { sort = "desc", status } = req.query;

  const quotproducts = await QuotProduct.getAll({
    sort: sort as "desc" | "asc",
    status: status as "all" | "active" | "inactive",
  });
  res.status(200).send({ code: 200, quotproducts });
});

app.get("/cucop/api/quotations/quot-products/:id", auth, async (req, res) => {
  const quotproducts = await QuotProduct.getByQuotId(req.params.id);
  res.status(200).send({ code: 200, quotproducts });
});

app.get("/cucop/api/quot-products/:id", auth, async (req, res) => {
  const quotproduct = await QuotProduct.getById(req.params.id);
  res.status(200).send({ code: 200, quotproduct });
});

app.post("/cucop/api/quot-products/", auth, async (req, res) => {
  const id = await QuotProduct.create(req.body);
  const code = id == -1 ? 400 : 200;
  res.status(code).send({ id });
});

app.post(
  "/cucop/api/quot-products/load/:qid",
  auth,
  upload.single("file"),
  async (req, res) => {
    const qid = req.params.qid;
    const file = req.file;

    if (!file) {
      return res.status(400).send({ code: 400, logs: "No file uploaded" });
    }

    try {
      const logs = await QuotProduct.load(file.buffer, qid);
      res.status(200).send({ code: 200, logs });
    } catch (ex) {
      console.log(ex);
      res
        .status(500)
        .send({ code: 500, logs: `Error al procesar el Archivo\n` });
    }
  },
);

app.put("/cucop/api/quot-products/:id", auth, async (req, res) => {
  const updated = await QuotProduct.update(req.params.id, req.body);
  const code = updated ? 200 : 400;
  res.status(code).send({ code });
});

app.delete("/cucop/api/quot-products/:id", auth, async (req, res) => {
  const updated = await QuotProduct.remove(req.params.id);
  const code = updated ? 200 : 400;
  res.status(code).send({ code });
});

export default app;
