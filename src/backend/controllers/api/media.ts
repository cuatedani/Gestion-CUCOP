import express from "express";
import Media, { ICreateMedia } from "../../models/media";
import auth from "../../middlewares/auth";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadImage = upload.fields([{ name: "media", maxCount: 1 }]);

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

    const file = files["media"][0];
    const name = uuidv4();
    const extension = file.mimetype.split("/")[1];
    const finalPath = `uploads/${category}/${name}.${extension}`;
    const filePath = path.join(__dirname, `../../../frontend/${finalPath}`);
    await fs.writeFile(filePath, file.buffer);
    const body: ICreateMedia = {
      objectId: parseInt(req.params.id),
      name,
      extension,
      category,
      rol: "main",
      owner: "CICESE-UT3",
      url: finalPath,
    };
    const id = await Media.create(body);
    res.status(200).send({ id });
  },
);

app.get("/cucop/api/medias/:category/:id", auth, async (req, res) => {
  const id = req.params.id;
  const category = req.params.category;

  try {
    const media = await Media.getByObjectId(parseInt(id), category);

    if (!media) {
      return res.status(404).send({ code: 404, msg: "Media not found" });
    }

    res.status(200).send({ code: 200, media });
  } catch (error) {
    console.error(error);
    res.status(500).send({ code: 500, msg: "Internal Server Error" });
  }
});

app.get("/cucop/api/medias/:mid", auth, async (req, res) => {
  const id = req.params.mid;

  try {
    const media = await Media.getFile(parseInt(id));

    if (!media) {
      return res.status(404).send({ code: 404, msg: "Media not found" });
    }

    const filePath = path.join(__dirname, `../../../frontend/${media.url}`);

    try {
      await fs.access(filePath);
      res.sendFile(filePath);
    } catch (err) {
      res.status(404).send({ code: 404, msg: "File not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ code: 500, msg: "Internal Server Error" });
  }
});

export default app;
