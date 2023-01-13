const express = require("express");
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const flash = require("flash");
const ejs = require("ejs");
// const database = mongoose.connect("mongodb://localhost:27017/Mini_Project");
mongoose.set("strictQuery", true);
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { fileURLtopath } = require("url");
const path = require("path");
const { jar } = require("request");
let database;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("views"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.listen(8080, () => {
  MongoClient.connect(
    "mongodb://localhost:27017",
    { useNewUrlParser: true },
    (error, result) => {
      if (error) throw error;
      database = result.db("Mini_Project");
      console.log("Connection Successful");
    }
  );
});
app.get("/getdata", (req, res) => {
  database
    .collection("names")
    .find({})
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});
app.get("/book", function (req, res) {
  res.sendFile(__dirname + "/views/book.html");
});
app.post("/book", function (req, res) {
  const request = req.body.hotel;
  const arr = database
    .collection("names")
    .find({ area: `${request}` })
    .toArray((err, result) => {
      if (err) throw err;
      result;
    });
  console.log(arr);
  // res.sendFile(__dirname + "/views/book.html");
});
app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/views/login.html");
});
app.get("/about", function (req, res) {
  res.sendFile(__dirname + "/views/about.html");
});
app.listen(3000, () => console.log(`Server is listening on port 3000`));
