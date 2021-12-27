const logEvents = require("./log");
const http = require("http");
const fs = require("fs");
const path = require("path");
const fsPromises = require("fs").promises;

const EventEmitter = require("events");
class Emitter extends EventEmitter {}

const myEmitter = new Emitter();
myEmitter.on("log", (msg) => logEvents(msg));

// setTimeout(() => {
//   myEmitter.emit("log", "Log event emitted new");
// }, 2000);

const PORT = process.env.PORT || 3500;
const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
});

server.listen(PORT, () => {
  console.log("Server listening on " + PORT);
});
