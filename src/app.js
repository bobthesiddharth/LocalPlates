const express = require("express");
const platesRouter = require("./routes/plates");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to LocalPlates! Find the nearest plates near you." });
});

app.use("/plates", platesRouter);

module.exports = app;
