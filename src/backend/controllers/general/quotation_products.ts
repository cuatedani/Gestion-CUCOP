import express from "express";
import path from "path";
import auth from "../../middlewares/auth";
const app = express();

// Views
app.set("views", path.join(__dirname, "../../../frontend/views/general"));

app.get("/cucop/lists/:lid/quotation/:qid", auth, async function (req, res) {
  res.render("quot_products", { user: req.session.user });
});

app.get(
  "/cucop/lists/:lid/quotation/:qid/product/create",
  auth,
  async function (req, res) {
    res.render("quot_products_operation", {
      operation: "create",
      user: req.session.user,
    });
  },
);

app.get(
  "/cucop/lists/:lid/quotation/:qid/product/:qpid/edit",
  auth,
  async function (req, res) {
    res.render("quot_products_operation", {
      operation: "edit",
      user: req.session.user,
    });
  },
);

app.get(
  "/cucop/lists/:lid/quotation/:qid/product/load",
  auth,
  async function (req, res) {
    res.render("quot_products_load", {
      user: req.session.user,
    });
  },
);

export default app;
