const express = require("express");
const path = require("path");

const router = express.Router();
router.get("^/$|^/blog(.html)?", (req, res) => {
  res.sendFile("./blog.html", {
    root: path.join("UI", "pagess"),
  });
});
router.get("^/detail$|^/detail(.html)?", (req, res) => {
  res.sendFile("./detail.html", {
    root: path.join("UI", "pages"),
  });
});

module.exports = router;
