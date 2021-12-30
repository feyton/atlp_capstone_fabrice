const express = require("express");
const path = require("path");

const router = express.Router();
router.get("^/$|^/index(.html)?", (req, res) => {
  res.sendFile("./index.html", {
    root: path.join((path.dirname(__dirname), "UI")),
  });
  //   console.log(path.dirname(__dirname));
});
router.get("/pages/about(.html)?|/about(.html)?", (req, res) => {
  res.sendFile("./pages/about.html", {
    root: path.join((path.dirname(__dirname), "UI")),
  });
  //   console.log(path.dirname(__dirname));
});

router.get("/pages/login(.html)?|/login(.html)?", (req, res) => {
  res.sendFile("./pages/login.html", {
    root: path.join((path.dirname(__dirname), "UI")),
  });
  //   console.log(path.dirname(__dirname));
});

router.get("/pages/signup(.html)?|/signup(.html)?", (req, res) => {
  res.sendFile("./pages/signup.html", {
    root: path.join((path.dirname(__dirname), "UI")),
  });
  //   console.log(path.dirname(__dirname));
});

router.get("/pages/work(.html)?|/work(.html)?", (req, res) => {
  res.sendFile("./pages/work.html", {
    root: path.join((path.dirname(__dirname), "UI")),
  });
  //   console.log(path.dirname(__dirname));
});
router.get("/pages/profile(.html)?|/profile(.html)?", (req, res) => {
  res.sendFile("./pages/profile.html", {
    root: path.join((path.dirname(__dirname), "UI")),
  });
  //   console.log(path.dirname(__dirname));
});

module.exports = router;
