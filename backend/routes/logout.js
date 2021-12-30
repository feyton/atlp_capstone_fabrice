const express = require("express");
const router = express.Router();
const path = require("path");
const authController = require("../controllers/logoutController");
router.get("/", authController.handleLogout);

// router.get("/", (req, res) => {
  
// });
module.exports = router;
