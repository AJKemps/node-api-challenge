const express = require("express");
const CORS = require("cors");
const projectsRouter = require("./projects/projectsRouter");
const actionsRouter = require("./actions/actionsRouter");

const server = express();

server.use(express.json());
server.use(CORS());

server.use("/projects", projectsRouter);
server.use("/actions", actionsRouter);

server.get("/", (req, res) => {
  res.status(200).json({ message: "hello world" });
});

module.exports = server;
