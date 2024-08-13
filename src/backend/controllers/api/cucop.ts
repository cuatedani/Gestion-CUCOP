import express from "express";
import Cucop from "../../models/cucop";
import auth from "../../middlewares/auth";

const app = express();
app.get("/cucop/api/cucop", auth, async (req, res) => {
  const cucop = await Cucop.getAll(req.query);
  res.status(200).send({ code: 200, cucop });
});

app.get("/cucop/api/cucop/chapters", auth, async (req, res) => {
  const categorias = await Cucop.getChapters();
  res.status(200).send({ code: 200, categorias });
});

app.get("/cucop/api/cucop/concepts/:cap", auth, async (req, res) => {
  const categorias = await Cucop.getConcepts(req.params.cap);
  res.status(200).send({ code: 200, categorias });
});

app.get("/cucop/api/cucop/generics/:con", auth, async (req, res) => {
  const categorias = await Cucop.getGenerics(req.params.con);
  res.status(200).send({ code: 200, categorias });
});

app.get("/cucop/api/cucop/specifics/:gen", auth, async (req, res) => {
  const categorias = await Cucop.getSpecifics(req.params.gen);
  res.status(200).send({ code: 200, categorias });
});

app.get("/cucop/api/cucop/:id", auth, async (req, res) => {
  const cucop = await Cucop.getById(req.params.id);
  res.status(200).send({ code: 200, cucop });
});

app.post("/cucop/api/cucop", auth, async (req, res) => {
  const created = await Cucop.create(req.body);
  const code = created ? 200 : 400;
  res.status(code).send({ code });
});

app.put("/cucop/api/cucop/:id", auth, async (req, res) => {
  const updated = await Cucop.update(req.params.id, req.body);
  const code = updated ? 200 : 400;
  res.status(code).send({ code });
});

app.delete("/cucop/api/cucop/:id", auth, async (req, res) => {
  const updated = await Cucop.remove(req.params.id);
  const code = updated ? 200 : 400;
  res.status(code).send({ code });
});

app.get("/cucop/api/cucop/load/:clv", auth, async (req, res) => {
  const id = await Cucop.existsClave(req.params.clv);
  res.status(200).send({ code: 200, id });
});

export default app;
