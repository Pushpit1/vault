import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Vault API is running 🚀");
});

export default app;