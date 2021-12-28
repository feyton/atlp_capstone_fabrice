const express = require("express");
const path = require("path");

const router = express.Router();

router.get("^/login(.html)?", (req, res) => {
  res.sendFile("./login.html", {
    root: path.join("UI", "pages"),
  });
});
router.get("^/register|^/signup(.html)?", (req, res) => {
  res.sendFile("./signup.html", {
    root: path.join("UI", "pages"),
  });
});

module.exports = router;
