import express from "express";
import path from "path";
import auth from "../../middlewares/auth";
const app = express();

// Views
app.set("views", path.join(__dirname, "../../../frontend/views/general"));

app.get("/cucop/users", auth, async function (req, res) {
  res.render("users", { user: req.session.user });
});

app.get("/cucop/users/create", auth, async function (req, res) {
  res.render("users_operation", {
    operation: "create",
    user: req.session.user,
  });
});

app.get("/cucop/users/:id/edit", auth, async function (req, res) {
  res.render("users_operation", {
    operation: "edit",
    user: req.session.user,
  });
});

export default app;
