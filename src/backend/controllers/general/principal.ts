import express from "express";
import path from "path";

const app = express();

// Set the views folder
app.set("views", path.join(__dirname, "../../../frontend/views/general"));

// Routes
app.get("/cucop", async (req, res) => {
  res.redirect("/cucop/lists/create");
});

export default app;
