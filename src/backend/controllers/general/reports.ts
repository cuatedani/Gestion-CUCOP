import express from "express";
import path from "path";
import auth from "../../middlewares/auth";

const app = express();

// Set the views folder
app.set("views", path.join(__dirname, "../../../frontend/views/general"));

app.get("/time/reports", auth, async (req, res) => {
  res.render("reports", { user: req.session.user });
});
export default app;
