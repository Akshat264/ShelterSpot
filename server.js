const express = require("express");
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const flash = require("flash");
const ejs = require("ejs");
const port = process.env.PORT || 3000;
// const database = mongoose.connect("mongodb://localhost:27017/Mini_Project");
mongoose.set("strictQuery", true);
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { fileURLtopath } = require("url");
const path = require("path");
const { jar } = require("request");
const { ftruncateSync, readSync } = require("fs");
let database;
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// app.get("/", function (req, res) {
//   res.render(__dirname + "/views/index.ejs");
// });
// app.get("/book", function (req, res) {
//   res.render(__dirname + "/views/book.ejs");
// });
let search_Array;
console.log(process.env.MONGODB_URI)
app.post("/book.html", function (req, res) {
  const request = req.body.hotel;
  MongoClient.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true },
    (err, db) => {
      if (err) throw err;
      let dbo = db.db("Mini_Project");
      let query = { area: `${request}` };
      dbo
        .collection("names")
        .find(query, {
          projection: {
            _id: 0,
            area: 1,
            city: 1,
            highlight_value: 1,
            hotel_overview: 1,
            hotel_star_rating: 1,
            in_your_room: 1,
            property_name: 1,
            property_address: 1,
            latitude: 1,
            longitude: 1,
            pageurl: 1,
            room_types: 1,
            price_per_room_per_day: 1,
            img_url: 1,
            img_url2: 1,
            img_url3: 1,
            img_url4: 1,
            location: 1,
          },
        })
        .toArray((err, result) => {
          if (result.length === 0) {
            res.send("<h1>Sorry! This location is not Available.</h1>");
          } else {
            search_Array = result;
            // console.log(search_Array);
            res.render(__dirname + "/views/book.ejs", {
              search_Array: search_Array,
            });
          }
          // search_Array.forEach((element) => {
          //   console.log(
          //     `Hotel Name: ${element.property_name}\nAddress: ${element.property_address}\nStar Rating: ${element.hotel_star_rating} star\nHighlight Value: ${element.highlight_value}`
          //   );
          // });
          // console.log(search_Array);
          db.close();
        });
    }
  );
  // res.sendFile(__dirname + "/views/book.html");
});
app.post("/details", function (req, res) {
  const hotel_name = req.body.hotel_name;
  const hotel_address = req.body.hotel_address;
  const hotel_rating = req.body.hotel_rating;
  const hotel_overview = req.body.hotel_overview;
  const hotel_highlight_value = req.body.hotel_highlight_value;
  const in_your_room = req.body.hotel_in_your_room;
  const pageurl = req.body.hotel_pageurl;
  const hotel_img = req.body.hotel_img;
  const hotel_img1 = req.body.hotel_img1;
  const hotel_img2 = req.body.hotel_img2;
  const hotel_img3 = req.body.hotel_img3;
  const location = req.body.location;
  const price = req.body.price;
  res.render(__dirname + "/views/details.ejs", {
    hotel_name: hotel_name,
    address: hotel_address,
    rating: hotel_rating,
    overview: hotel_overview,
    highlight: hotel_highlight_value,
    room_facility: in_your_room,
    url: pageurl,
    img1: hotel_img,
    img2: hotel_img1,
    img3: hotel_img2,
    img4: hotel_img3,
    location: location,
    price: price,
  });
});
app.post("/login", function (req, res) {
  const name = req.body.fname + " " + req.body.lname;
  const email = req.body.mail;
  const password = req.body.pass1;
  MongoClient.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true },
    (err, db) => {
      if (err) throw err;
      let dbo = db.db("Mini_Project");
      dbo
        .collection("users")
        .insertOne({ name: name, email_id: email, password: password });
    }
  );
  res.render(__dirname + "/views/login.ejs", { name: name });
});
let resul;

app.post("/index:logged_in", function (req, res) {
  const email = req.body.mail_id;
  const password = req.body.pass;
  MongoClient.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true },
    (err, db) => {
      if (err) throw err;
      let query = { email_id: `${email}`, password: `${password}` };
      let dbo = db.db("Mini_Project");
      dbo
        .collection("users")
        .find(query, { projection: { name: 1, email_id: 1, password: 1 } })
        .toArray((err, result) => {
          if (result.length === 0) {
            res.sendFile(__dirname + "/public/login2.html");
          } else {
            resul = result;
            res.render(__dirname + "/views/index.ejs", { result: resul });
          }
        });
    }
  );
});
app.get("/index:logged_in", function (req, res) {
  res.render(__dirname + "/views/index.ejs", {
    result: [{ name: "You can get more details in About Section" }],
  });
});
// app.get("/login", function (req, res) {
//   res.render(__dirname + "/views/login.ejs");
// });
// app.get("/about", function (req, res) {
//   res.render(__dirname + "/views/about.ejs");
// });
app.post("/reset-password", function (req, res) {
  const mail = req.body.mail;
  MongoClient.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true },
    (err, db) => {
      if (err) throw err;
      let dbo = db.db("Mini_Project");
      let query = { email_id: `${mail}` };
      dbo.collection("users").findOne(
        query,
        {
          projection: {
            password: 1,
          },
        },
        (err, response) => {
          if (response == null) res.send("Invalid Email");
          else {
            res.send(`<h1>Your Password is ${response.password}</h1>`);
          }
        }
      );
    }
  );
});
app.listen(port, () => {console.log(`Server is listening on port ${port}`));console.log(process.env.MONGODB_URI);};
