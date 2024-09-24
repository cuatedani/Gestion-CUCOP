import express from "express";
import Permit from "../../models/permit";
import auth from "../../middlewares/auth";

const app = express();
app.get("/cucop/api/permits", auth, async (req, res) => {
  const permits = await Permit.getAll();
  res.status(200).send({ code: 200, permits });
});

app.post("/cucop/api/permits", auth, async (req, res) => {
  const created = await Permit.create(req.body);
  const code = created ? 200 : 400;
  res.status(code).send({ code });
});

app.put("/cucop/api/permits/:id", auth, async (req, res) => {
  const updated = await Permit.update(req.params.id, req.body);
  const code = updated ? 200 : 400;
  res.status(code).send({ code });
});

app.delete("/cucop/api/permits/:id", auth, async (req, res) => {
  const updated = await Permit.remove(req.params.id);
  const code = updated ? 200 : 400;
  res.status(code).send({ code });
});

export default app;
