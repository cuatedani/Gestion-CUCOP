import express from "express";
import path from "path";
import Session from "../../models/session";
import { IUser } from "../../models/user";

const app = express();

// Views
app.set("views", path.join(__dirname, "../../../frontend/views/general"));

app.get("/time/login", function (req, res) {
  res.render("login");
});

app.get("/time/login/verify", async (req, res) => {
  const { token } = req.query;
  if (!token) return res.redirect("/time/login");
  const correct = await Session.verifyToken(token as string);
  if (correct) {
    req.session.token = token as string;
    req.session.user = Session.decodeToken(token as string) as IUser;
    return res.redirect("/time/checks/create");
  } else {
    res.redirect("/time/login");
  }
});

app.get("/time/logout", function (req, res) {
  req.session.destroy(() => {
    res.redirect("/time/login");
  });
});

export default app;
