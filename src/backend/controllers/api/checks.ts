import express from "express";
import Check, { ICheckType } from "../../models/check";
import auth from "../../middlewares/auth";

const app = express();

app.get("/time/api/checks", auth, async (req, res) => {
  const { sort = "desc", type, status, customerId } = req.query;

  const checks = await Check.getAll({
    sort: sort as "desc" | "asc",
    type: type as ICheckType,
    status: status as "all" | "active" | "inactive",
    customerId: parseInt(customerId as string),
  });
  res.status(200).send({ code: 200, checks });
});

app.get("/time/api/checks/:id", auth, async (req, res) => {
  const check = await Check.getById(req.params.id);
  res.status(200).send({ code: 200, check });
});

app.post("/time/api/checks/:id", auth, async (req, res) => {
  const customerId = Number(req.params.id);
  const type = req.body.type;
  const id = await Check.create({ customerId, type, active: true });
  const code = id == -1 ? 400 : 200;
  res.status(code).send({ id });
});

app.put("/time/api/check/:id", auth, async (req, res) => {
  const updated = await Check.update(req.params.id, req.body);
  const code = updated ? 200 : 400;
  res.status(code).send({ code });
});

app.delete("/time/api/check/:id", auth, async (req, res) => {
  const updated = await Check.remove(req.params.id);
  const code = updated ? 200 : 400;
  res.status(code).send({ code });
});

export default app;
