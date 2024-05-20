import express from "express";
import path from "path";
import auth from "../../middlewares/auth";

const app = express();

// Set the views folder
app.set("views", path.join(__dirname, "../../../frontend/views/general"));

app.get("/time/checks", auth, async (req, res) => {
  res.render("checks", { user: req.session.user });
});

app.get("/time/checks/create", auth, async (req, res) => {
  res.render("checks_operation", {
    operation: "create",
    user: req.session.user,
  });
});

app.get("/time/checks/:id/edit", auth, async (req, res) => {
  res.render("checks_operation", { operation: "edit", user: req.session.user });
});

export default app;
