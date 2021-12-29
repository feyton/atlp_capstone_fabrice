require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const { logEvents, logger } = require("./middleware/logEvents");
const fsPromises = require("fs").promises;
const cors = require("cors");
const { errorHandler } = require("./middleware/errorHandler");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConfig");

const app = express();

const PORT = process.env.PORT || 3500;

connectDB();

// Custom middleware
app.use(logger);
const whiteList = [
  "https://www.feyton.co.rw",
  "http://127.0.0.1:5500",
  "http://localhost:3500",
  "http://localhost:5000",
  "https://atlp-fabrice.herokuapp.com/",
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
app.use(
  "/dashboard",
  express.static(path.join(path.dirname(__dirname), "UI/public"))
);

app.use("/dashboard", require("./routes/dashboard"));
// app.use('/blog') //To do
app.use("/", require("./routes/root"));
// Handling 404
app.all("*", (req, res) => {
  res.status(404);

  if (req.accepts("html")) {
    res.sendFile("./pages/404.html", {
      root: path.join((path.dirname(__dirname), "UI")),
    });
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not found" });
  } else {
    res.type("txt").send("404 Not found");
  }
});

//Error handling

app.use(errorHandler);
mongoose.connection.once("open", () => {
  console.log("Connected");
  app.listen(PORT, () => {
    console.log("Server listening on " + PORT);
  });
});
