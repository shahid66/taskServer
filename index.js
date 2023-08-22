const express = require("express");
const app = express();
const helmet = require("helmet");
const mongoose = require("mongoose");
require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const { readdirSync } = require("fs");
const router = require("./src/routes/api");
const path = require("path");

// middlewares
app.use(helmet());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());

// DB Connection
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.log("DB Error => ", err));

// routes middleware
app.use(router);

app.use(express.static("client/build"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

// server\

const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log(`App is  running on port ${port}`);
});
