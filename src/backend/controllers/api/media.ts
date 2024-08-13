import express from "express";
import Media, { ICreateMedia } from "../../models/media";
import auth from "../../middlewares/auth";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadImage = upload.fields([{ name: "media", maxCount: 10 }]);

app.post(
  "/cucop/api/medias/:category/:id/",
  auth,
  uploadImage,
  async (req, res) => {
    const { category } = req.params;
    const allowed = ["quotations"];
    if (allowed.indexOf(category) == -1) {
      return res.status(400).send({ code: 400, msg: "Invalid category" });
    }

    const files = req.files as { [fileName: string]: Express.Multer.File[] };

    const mediaRecords = await Promise.all(
      files["media"].map(async (file) => {
        const { name, ext } = path.parse(file.originalname);
        const finalname = `${name}-${Math.floor(1000 + Math.random() * 9000)}`;
        const extension = ext;
        const finalPath = `public/uploads/${category}/${name}.${extension}`;
        const filePath = path.join(__dirname, `../../../frontend/${finalPath}`);
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
  },
);

app.get("/cucop/api/medias/:mid", auth, async (req, res) => {
  const id = req.params.id;
  const cat = req.params.category;

  try {
    const medias = await Media.getByObjectId(parseInt(id), cat);

    if (!medias) {
      return res.status(404).send({ code: 404, msg: "Media not found" });
    }

    try {
      res.status(200).send({ code: 200, medias });
    } catch (err) {
      res.status(404).send({ code: 404, msg: "File not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ code: 500, msg: "Internal Server Error" });
  }
});

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
