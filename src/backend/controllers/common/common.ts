import express from "express";
import path from "path";

const app = express();

// Set the views folder
app.set("views", path.join(__dirname, "../../../frontend/views/common"));

app.use((req, res) => {
  res.render("404");
});
export default app;
