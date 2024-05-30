import express from "express";
import List from "../../models/list";
import auth from "../../middlewares/auth";

const app = express();

app.get("/cucop/api/lists", auth, async (req, res) => {
  const { sort = "desc", status } = req.query;

  const lists = await List.getAll({
    sort: sort as "desc" | "asc",
    status: status as "all" | "active" | "inactive",
  });

  res.status(200).send({ code: 200, lists });
});

app.get("/cucop/api/lists/:id", auth, async (req, res) => {
  const list = await List.getById(req.params.id);
  res.status(200).send({ code: 200, list });
});

app.post("/cucop/api/lists", auth, async (req, res) => {
  const id = await List.create(req.body);
  const code = id == -1 ? 400 : 200;
  res.status(code).send({ id });
});

app.put("/cucop/api/lists/:id", auth, async (req, res) => {
  const updated = await List.update(req.params.id, req.body);
  const code = updated ? 200 : 400;
  res.status(code).send({ code });
});

app.delete("/cucop/api/lists/:id", auth, async (req, res) => {
  const updated = await List.remove(req.params.id);
  const code = updated ? 200 : 400;
  res.status(code).send({ code });
});

export default app;
