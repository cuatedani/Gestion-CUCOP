import express from "express";
import path from "path";
import auth from "../../middlewares/auth";
const app = express();

// Views
app.set("views", path.join(__dirname, "../../../frontend/views/general"));

app.get("/cucop/lists", auth, async function (req, res) {
  res.render("lists", { user: req.session.user });
});

app.get("/cucop/lists/create", auth, async function (req, res) {
  res.render("lists_operation", {
    operation: "create",
    user: req.session.user,
  });
});

app.get("/cucop/lists/:id/edit", auth, async function (req, res) {
  res.render("lists_operation", {
    operation: "edit",
    user: req.session.user,
  });
});

export default app;
