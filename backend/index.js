const express = require("express");
const fs = require("fs");
const path = require("path");
const { logEvents, logger } = require("./log");
const fsPromises = require("fs").promises;
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3500;

// Custom middleware
app.use(logger);
const whiteList = [
  "https://www.feyton.co.rw",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:3500",
];

// Using cors to allow access

const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(path.dirname(__dirname), "UI/public")));

app.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile("./index.html", {
    root: path.join((path.dirname(__dirname), "UI")),
  });
  //   console.log(path.dirname(__dirname));
});
app.get("/pages/about(.html)?|/about(.html)?", (req, res) => {
  res.sendFile("./pages/about.html", {
    root: path.join((path.dirname(__dirname), "UI")),
  });
  //   console.log(path.dirname(__dirname));
});
app.get("/pages/blog(.html)?|/blog(.html)?", (req, res) => {
  res.sendFile("./pages/blog.html", {
    root: path.join((path.dirname(__dirname), "UI")),
  });
  //   console.log(path.dirname(__dirname));
});
app.get("/pages/detail(.html)?|/blog/detail(.html)?", (req, res) => {
  res.sendFile("./pages/detail.html", {
    root: path.join((path.dirname(__dirname), "UI")),
  });
  //   console.log(path.dirname(__dirname));
});

// Route Handlers

// app.get(
//   "/blog(.html)?",
//   (req, res, next) => {
//     console.log("Hello there");
//     next();
//   },
//   (req, res) => {
//     res.send("testing");  //Testing the use of next like in login and next
//   }
// );

// Handling 404
app.get("/*", (req, res) => {
  res.status(404).send("Page not found");
});
app.listen(PORT, () => {
  console.log("Server listening on " + PORT);
});
