const express = require("express");
const path = require("path");

const router = express.Router();

router.get("^/$|^/index(.html)?", (req, res) => {
  res.sendFile("./index.html", {
    root: path.join("UI", "dashboard"),
  });
});
router.get("^/blog$|^/blog(.html)?", (req, res) => {
  res.sendFile("./blog.html", {
    root: path.join("UI", "dashboard"),
  });
});
router.get("^/create$|^/create(.html)?", (req, res) => {
  res.sendFile("./create.html", {
    root: path.join("UI", "dashboard"),
  });
});

module.exports = router;
