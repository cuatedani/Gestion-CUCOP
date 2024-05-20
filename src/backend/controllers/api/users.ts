import express from "express";
import User from "../../models/user";
import auth from "../../middlewares/auth";

const app = express();

app.get("/time/api/users", auth, async (req, res) => {
  const { status = "all" } = req.query;
  const users = await User.getAll({
    status: status as "all" | "active" | "inactive",
  });
  res.status(200).send({ code: 200, users });
});

app.get("/time/api/users/:id", auth, async (req, res) => {
  const user = await User.getById(req.params.id);
  res.status(200).send({ code: 200, user });
});

app.post("/time/api/users", auth, async (req, res) => {
  const id = await User.create(req.body);
  res.status(200).send({ code: 200, id });
});

app.put("/time/api/users/:id", auth, async (req, res) => {
  const updated = await User.update(req.params.id, req.body);
  const code = updated ? 200 : 400;
  res.status(code).send({ code });
});

app.delete("/time/api/users/:id", auth, async (req, res) => {
  const deleted = await User.remove(req.params.id);
  const code = deleted ? 200 : 400;
  res.status(code).send({ code });
});

export default app;
