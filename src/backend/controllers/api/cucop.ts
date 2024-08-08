import express from "express";
import multer from "multer";
import Cucop from "../../models/cucop";
import auth from "../../middlewares/auth";

const app = express();
const upload = multer();

app.get("/cucop/api/cucop", auth, async (req, res) => {
  const cucop = await Cucop.getAll();
  res.status(200).send({ code: 200, cucop });
});

app.get("/cucop/api/cucop/capitulos", auth, async (req, res) => {
  const cucop = await Cucop.getCapitulos();
  res.status(200).send({ code: 200, cucop });
});

app.get("/cucop/api/cucop/conceptos/:cap", auth, async (req, res) => {
  const cucopdata = await Cucop.getRegCapitulos(req.params.cap);
  const cucop = await Cucop.getConceptos(req.params.cap);
  res.status(200).send({ code: 200, cucop, cucopdata });
});

app.get("/cucop/api/cucop/genericas/:con", auth, async (req, res) => {
  const cucopdata = await Cucop.getRegConceptos(req.params.con);
  const cucop = await Cucop.getGenericas(req.params.con);
  res.status(200).send({ code: 200, cucop, cucopdata });
});

app.get("/cucop/api/cucop/especificas/:gen", auth, async (req, res) => {
  const cucopdata = await Cucop.getRegGenericas(req.params.gen);
  const cucop = await Cucop.getEspecificas(req.params.gen);
  res.status(200).send({ code: 200, cucop, cucopdata });
});

app.get("/cucop/api/cucop/registros/:esp", auth, async (req, res) => {
  const cucop = await Cucop.getRegEspecificas(req.params.esp);
  res.status(200).send({ code: 200, cucop });
});

app.get("/cucop/api/cucop/:id", auth, async (req, res) => {
  const cucop = await Cucop.getById(req.params.id);
  res.status(200).send({ code: 200, cucop });
});

app.post("/cucop/api/cucop", auth, async (req, res) => {
  const updated = await Cucop.create(req.body);
  const code = updated ? 200 : 400;
  res.status(code).send({ code });
});

app.post(
  "/cucop/api/cucop/load",
  auth,
  upload.single("file"),
  async (req, res) => {
    const file = req.file;

    if (!file) {
      return res.status(400).send({ code: 400, logs: "No file uploaded" });
    }

    try {
      const logs = await Cucop.load(file.buffer);
      res.status(200).send({ code: 200, logs });
    } catch (ex) {
      console.log(ex);
      res
        .status(500)
        .send({ code: 500, logs: `Error al procesar el Archivo\n` });
    }
  },
);

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
  const id = await Cucop.existsclv(req.params.clv);
  res.status(200).send({ code: 200, id });
});

export default app;
