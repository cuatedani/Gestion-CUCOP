import express from "express";
import auth from "../../middlewares/auth";
import Contact from "../../models/contact";

const app = express();

app.get("/time/api/contacts", auth, async (req, res) => {
  const { status = "all" } = req.query;
  const contacts = await Contact.getAll({
    status: status as "all" | "active" | "inactive",
  });
  res.status(200).send({ contacts });
});

app.get("/time/api/contacts/:id", auth, async (req, res) => {
  const contact = await Contact.getById(req.params.id);
  res.status(200).send({ contact });
});

app.post("/time/api/contacts", auth, async (req, res) => {
  const id = await Contact.create(req.body);
  res.status(200).send({ id });
});

app.put("/time/api/contacts/:id", auth, async (req, res) => {
  const updated = await Contact.update(req.params.id, req.body);
  const code = updated ? 200 : 400;
  res.status(code).send({});
});

app.delete("/time/api/contacts/:id", auth, async (req, res) => {
  const updated = await Contact.remove(req.params.id);
  const code = updated ? 200 : 400;
  res.status(code).send({});
});

export default app;
