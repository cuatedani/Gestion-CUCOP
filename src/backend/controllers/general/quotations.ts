import express from "express";
import path from "path";
import auth from "../../middlewares/auth";
const app = express();

// Views
app.set("views", path.join(__dirname, "../../../frontend/views/general"));

app.get("/cucop/lists/:lid/", auth, async function (req, res) {
  res.render("quotations", { user: req.session.user });
});

app.get("/cucop/lists/:lid/quotation/create", auth, async function (req, res) {
  res.render("quotations_operation", {
    operation: "create",
    user: req.session.user,
  });
});

app.get(
  "/cucop/lists/:lid/quotation/:qid/edit",
  auth,
  async function (req, res) {
    res.render("quotations_operation", {
      operation: "edit",
      user: req.session.user,
    });
  },
);

app.get(
  "/cucop/lists/:lid/quotation/:qid/file",
  auth,
  async function (req, res) {
    res.render("quotations_file", {
      user: req.session.user,
    });
  },
);

export default app;
