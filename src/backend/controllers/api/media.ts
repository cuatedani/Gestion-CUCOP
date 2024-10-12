import express from "express";
import Media, { ICreateMedia } from "../../models/media";
import Cucop from "../../models/cucop";
import QuotProduct from "../../models/quotation_product";
import auth from "../../middlewares/auth";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadFile = upload.fields([{ name: "media", maxCount: 10 }]);

app.post(
  "/cucop/api/medias/:category/:id/",
  auth,
  uploadFile,
  async (req, res) => {
    const { category } = req.params;
    const allowed = ["quotations", "cucop", "quotationProducts"];
    if (allowed.indexOf(category) == -1) {
      return res
        .status(400)
        .send({ code: 400, type: "error", message: `Categoria Invalida` });
    }

    const files = req.files as { [fileName: string]: Express.Multer.File[] };

    if (category == "cucop") {
      const file = files["media"]?.[0];

      if (!file) {
        return res
          .status(400)
          .send({ code: 400, type: "error", message: `Sin archivo cargado` });
      }

      try {
        const logs = await Cucop.load(file.buffer);
        res.status(200).send({ code: 200, logs });
      } catch (ex) {
        console.log(ex);
        res.status(500).send({
          code: 500,
          type: "error",
          message: `Error al procesar el Archivo`,
        });
      }
    } else if (category == "quotationProducts") {
      const qid = req.params.id;
      const file = files["media"]?.[0];

      if (!file) {
        return res
          .status(400)
          .send({ code: 400, type: "error", message: `Sin archivo cargado` });
      }

      try {
        const logs = await QuotProduct.load(file.buffer, qid);
        res.status(200).send({ code: 200, logs });
      } catch (ex) {
        console.log(ex);
        res.status(500).send({
          code: 500,
          type: "error",
          message: `Error al procesar el Archivo`,
        });
      }
    } else {
      const mediaRecords = await Promise.all(
        files["media"].map(async (file) => {
          const { name, ext } = path.parse(file.originalname);
          const finalname = `${name}-${Math.floor(
            1000 + Math.random() * 9000,
          )}`;
          const extension = ext;
          const finalPath = `public/uploads/${category}/${name}.${extension}`;
          const filePath = path.join(
            __dirname,
            `../../../frontend/${finalPath}`,
          );
          await fs.writeFile(filePath, file.buffer);

          const body: ICreateMedia = {
            objectId: parseInt(req.params.id),
            name: finalname,
            extension,
            category,
            rol: "main", // Cambia según sea necesario
            owner: "CICESE-UT3", // Cambia según sea necesario
            url: finalPath,
          };

          const id = await Media.create(body);
          return id;
        }),
      );

      res.status(200).send({ ids: mediaRecords });
    }
  },
);

app.get("/cucop/api/medias/:category/:id", auth, async (req, res) => {
  const id = req.params.id;
  const category = req.params.category;

  try {
    const medias = await Media.getByObjectId(parseInt(id), category);

    if (!medias) {
      return res.status(404).send({ code: 404, msg: "Medias not found" });
    }

    res.status(200).send({ code: 200, medias });
  } catch (error) {
    console.error(error);
    res.status(500).send({ code: 500, msg: "Internal Server Error" });
  }
});

app.delete("/cucop/api/medias/:mid", auth, async (req, res) => {
  const media = await Media.getFile(parseInt(req.params.mid));

  if (!media) {
    return res.status(404).send({ code: 404, msg: "Media not found" });
  }

  const filePath = path.join(__dirname, `../../../frontend/${media.url}`);

  try {
    await fs.unlink(filePath);
    const removed = await Media.remove(req.params.mid);
    const code = removed ? 200 : 400;
    res.status(code).send({ code });
  } catch (error) {
    console.error(error);
    res.status(500).send({ code: 500, msg: "Internal Server Error" });
  }
});

export default app;
