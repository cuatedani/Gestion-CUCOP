import express from "express";
import path from "path";
import auth from "../../middlewares/auth";

const app = express();

// Set the views folder
app.set("views", path.join(__dirname, "../../../frontend/views/general"));

app.get("/time/customers", auth, async (req, res) => {
  res.render("customers", { user: req.session.user });
});

app.get("/time/customers/create", auth, async (req, res) => {
  res.render("customers_operation", {
    operation: "create",
    user: req.session.user,
  });
});

app.get("/time/customers/:id/edit", auth, async (req, res) => {
  res.render("customers_operation", {
    operation: "edit",
    user: req.session.user,
  });
});

app.get("/time/customers/:id", auth, async (req, res) => {
  res.render("customers_individual", { user: req.session.user });
});

export default app;
