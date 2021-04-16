const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Course = require("./models/course");
const Student = require("./models/student");

const app = express();

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  const { method, url } = req;
  console.log(`${method} ${url}`);
  next();
});

app.get("/", (req, res) => {
  res.json({
    "/courses": "nothing yet",
  });
});

mongoose.connect("mongodb://localhost/Friyay16-Apr-21", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const mongodb = mongoose.connection;

mongodb.on("open", () => {
  app.listen(4000, () => {
    console.log("Listening on http://localhost:4000");
  });
});
