const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGODB_URI)
  .then((res) => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
