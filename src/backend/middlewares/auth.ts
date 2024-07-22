import express from "express";
import path from "path";
import Session from "../models/session";

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "../../frontend/views/general"));

type INotAllowedItem = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  owner?: boolean;
};

type INotAllowed = {
  [key: string]: INotAllowedItem[];
  admin: INotAllowedItem[];
  normal: INotAllowedItem[];
};

const notAllowed: INotAllowed = {
  admin: [],
  normal: [],
};

app.use(async (req, res, next) => {
  const { route, method } = req;
  let rol = "normal";
  const data = Session.decodeToken(req.session.token as string);
  if (data) rol = data.rol;
  const exists = notAllowed[rol].find(
    (x) => x.method == method && x.path == route.path,
  );
  if (exists) res.redirect("/cucop/lists");
  next();
});

export const validToken = async (token?: string) => {
  if (!token) return 401;
  const valid = await Session.verifyToken(token);
  if (!valid) return 400;
  else return 200;
};

export default app;
