import express from "express";
import User from "../../models/user";
import auth from "../../middlewares/auth";

const app = express();

app.get("/cucop/api/users", auth, async (req, res) => {
  const { status = "all" } = req.query;
  const users = await User.getAll({
    status: status as "all" | "active" | "inactive",
  });
  res.status(200).send({ code: 200, users });
});

app.get("/cucop/api/users/:id", auth, async (req, res) => {
  const user = await User.getById(req.params.id);
  res.status(200).send({ code: 200, user });
});

app.post("/cucop/api/users", auth, async (req, res) => {
  const userData = {
    firstNames: req.body.firstNames,
    lastNames: req.body.lastNames,
    email: req.body.email,
    password: req.body.password,
    rol: req.body.rol,
    active: true,
  };

  const id = await User.create(userData);

  res.status(200).send({ code: 200, id });
});

app.put("/cucop/api/users/:id", auth, async (req, res) => {
  const updated = await User.update(req.params.id, req.body);
  const code = updated ? 200 : 400;
  res.status(code).send({ code });
});

app.delete("/cucop/api/users/:id", auth, async (req, res) => {
  const deleted = await User.remove(req.params.id);
  const code = deleted ? 200 : 400;
  res.status(code).send({ code });
});

export default app;
