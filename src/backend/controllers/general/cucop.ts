import express from "express";
import path from "path";
import auth from "../../middlewares/auth";
const app = express();

// Views
app.set("views", path.join(__dirname, "../../../frontend/views/general"));

app.get("/cucop/cucop", auth, async function (req, res) {
  res.render("cucop", { user: req.session.user });
});

app.get("/cucop/cucop/create", auth, async function (req, res) {
  res.render("cucop_operation", {
    operation: "create",
    user: req.session.user,
  });
});

app.get("/cucop/cucop/:id/edit", auth, async function (req, res) {
  res.render("cucop_operation", {
    operation: "edit",
    user: req.session.user,
  });
});

export default app;
