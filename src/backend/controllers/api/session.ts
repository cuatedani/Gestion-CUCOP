import express from "express";
import Session from "../../models/session";

const app = express();

app.post("/time/api/login", async (req, res) => {
  const { email, password } = req.body;
  const token = await Session.login(email, password);
  if (!token) return res.status(401).send({});
  else return res.status(200).send({ token });
});

export default app;
