import express from "express";
import Cucop from "../../models/cucop";
import auth from "../../middlewares/auth";

const app = express();

app.get("/cucop/api/cucop", auth, async (req, res) => {
  const { sort = "desc", status } = req.query;

  const checks = await Cucop.getAll({
    sort: sort as "desc" | "asc",
    status: status as "all" | "active" | "inactive",
  });
  res.status(200).send({ code: 200, checks });
});

app.get("/cucop/api/cucop/:id", auth, async (req, res) => {
  const cucop = await Cucop.getById(req.params.id);
  res.status(200).send({ code: 200, cucop });
});

app.post("/cucop/api/cucop", auth, async (req, res) => {
  const clavecucopid = req.body.clavecucopid;
  const clavecucop = req.body.clavecucop;
  const descripcion = req.body.descripcion;
  const unidaddemedida = req.body.unidaddemedida;
  const tipodecontratacion = req.body.tipodecontratacion;
  const partidaespecifica = req.body.partidaespecifica;
  const descpartidaespecifica = req.body.descpartidaespecifica;
  const partidagenerica = req.body.partidagenerica;
  const descpartidagenerica = req.body.descpartidagenerica;
  const concepto = req.body.concepto;
  const descconcepto = req.body.descconcepto;
  const capitulo = req.body.capitulo;
  const desccapitulo = req.body.desccapitulo;
  const fechaalta = req.body.fechaalta;
  const fechamodificacion = req.body.fechamodificacion;
  const id = await Cucop.create({
    clavecucopid,
    clavecucop,
    descripcion,
    unidaddemedida,
    tipodecontratacion,
    partidaespecifica,
    descpartidaespecifica,
    partidagenerica,
    descpartidagenerica,
    concepto,
    descconcepto,
    capitulo,
    desccapitulo,
    fechaalta,
    fechamodificacion,
    active: true,
  });
  const code = id == -1 ? 400 : 200;
  res.status(code).send({ id });
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

export default app;
