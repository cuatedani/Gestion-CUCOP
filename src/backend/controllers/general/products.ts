import express from "express";
import path from "path";
import auth from "../../middlewares/auth";
const app = express();

// Views
app.set("views", path.join(__dirname, "../../../frontend/views/general"));

app.get("/cucop/products", auth, async function (req, res) {
  res.render("products", { user: req.session.user });
});

app.get("/cucop/products/create", auth, async function (req, res) {
  res.render("products_operation", {
    operation: "create",
    user: req.session.user,
  });
});

app.get("/cucop/products/:id/edit", auth, async function (req, res) {
  res.render("products_operation", {
    operation: "edit",
    user: req.session.user,
  });
});

export default app;
