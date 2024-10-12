import express from "express";
import path from "path";
import auth from "../../middlewares/auth";
const app = express();

// Views
app.set("views", path.join(__dirname, "../../../frontend/views/general"));

app.get("/cucop/suppliers", auth, async function (req, res) {
  res.render("suppliers", { user: req.session.user });
});

app.get("/cucop/suppliers/create", auth, async function (req, res) {
  res.render("suppliers_operation", {
    operation: "create",
    user: req.session.user,
  });
});

app.get("/cucop/suppliers/:id/edit", auth, async function (req, res) {
  res.render("suppliers_operation", {
    operation: "edit",
    user: req.session.user,
  });
});

export default app;
