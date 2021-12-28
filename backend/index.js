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
  "http://localhost:3500",
];

// Using cors to allow access

const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
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

app.get("^/$|^/index(.html)?", (req, res) => {
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
app.get("/pages/blog(.html)?|^/blog(.html)?", (req, res) => {
  res.sendFile("./pages/blog.html", {
    root: path.join((path.dirname(__dirname), "UI")),
  });
  //   console.log(path.dirname(__dirname));
});
app.get("/pages/detail(.html)?|^/detail(.html)?", (req, res) => {
  res.sendFile("./pages/detail.html", {
    root: path.join((path.dirname(__dirname), "UI")),
  });
  //   console.log(path.dirname(__dirname));
});
app.get("/pages/login(.html)?|/login(.html)?", (req, res) => {
  res.sendFile("./pages/login.html", {
    root: path.join((path.dirname(__dirname), "UI")),
  });
  //   console.log(path.dirname(__dirname));
});

app.get("/pages/signup(.html)?|/signup(.html)?", (req, res) => {
  res.sendFile("./pages/signup.html", {
    root: path.join((path.dirname(__dirname), "UI")),
  });
  //   console.log(path.dirname(__dirname));
});

app.get("/pages/work(.html)?|/work(.html)?", (req, res) => {
  res.sendFile("./pages/work.html", {
    root: path.join((path.dirname(__dirname), "UI")),
  });
  //   console.log(path.dirname(__dirname));
});
app.get("/pages/profile(.html)?|/profile(.html)?", (req, res) => {
  res.sendFile("./pages/profile.html", {
    root: path.join((path.dirname(__dirname), "UI")),
  });
  //   console.log(path.dirname(__dirname));
});

app.get("^/dashboard(.html)?$|^/dashboard/index(.html)?$", (req, res) => {
  res.sendFile("./dashboard/index.html", {
    root: path.join((path.dirname(__dirname), "UI")),
  });
  //   console.log(path.dirname(__dirname));
});

app.get("^/dashboard/blog(.html)?$|^/dashboard/blog(.html)?$", (req, res) => {
  res.sendFile("./dashboard/blog.html", {
    root: path.join((path.dirname(__dirname), "UI")),
  });
  //   console.log(path.dirname(__dirname));
});
// Handling 404
app.get("/*", (req, res) => {
  res.status(404).sendFile("./pages/404.html", {
    root: path.join((path.dirname(__dirname), "UI")),
  });
});

// TO-DO Error handling
app.listen(PORT, () => {
  console.log("Server listening on " + PORT);
});
