import express from "express";
import path from "path";

const app = express();

// Set the views folder
app.set("views", path.join(__dirname, "../../../frontend/views/general"));

// Routes
app.get("/time", async (req, res) => {
  res.redirect("/time/checks/create");
});

export default app;
