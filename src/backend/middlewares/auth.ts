import express from "express";
import path from "path";
import Session from "../models/session";

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "../../frontend/views/general"));

app.use(async (req, res, next) => {
  //const data = Session.decodeToken(req.session.token as string);
  //if (!data) res.redirect("/cucop/login");
  next();
});

export const validToken = async (token?: string) => {
  if (!token) return 401;
  const valid = await Session.verifyToken(token);
  if (!valid) return 400;
  else return 200;
};

export default app;
