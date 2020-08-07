const express = require("express");
const Projects = require("../data/helpers/projectModel");

const router = express.Router();

router.get("/", (req, res) => {
  Projects.get()
    .then((response) => {
      res.status(200).json({ response });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "there was an error while retrieving the project" });
    });
});

router.get("/:id", validateProjectID, (req, res) => {
  let requestedProjectID = req.params.id;

  Projects.get(requestedProjectID)
    .then((response) => {
      res.status(200).json({ response });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "there was an error while retrieving the project" });
    });
});

router.post("/", validateProject, (req, res) => {
  let newProject = req.body;

  Projects.insert(newProject)
    .then((response) => {
      res.status(201).json(newProject);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "there was an issue while creating the project" });
    });
});

router.put("/:id", validateProjectID, validateProject, (req, res) => {
  let newProject = req.body;
  let requestedProjectID = req.params.id;

  Projects.update(requestedProjectID, newProject)
    .then((response) => {
      res.status(201).json(newProject);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "there was an issue while creating the project" });
    });
});

router.delete("/:id", validateProjectID, (req, res) => {});

function validateProject(req, res, next) {
  if (!req.body) {
    return res.status(400).json({ message: "missing user data" });
  } else if (!req.body.name) {
    return res.status(400).json({ message: "missing required name field" });
  } else if (!req.body.description) {
    return res
      .status(400)
      .json({ message: "missing required description field" });
  } else if (!req.body.completed) {
    return res
      .status(400)
      .json({ message: "missing required completed field" });
  } else {
    next();
  }
}

function validateProjectID(req, res, next) {
  let requestedProjectID = req.params.id;

  Projects.get(requestedProjectID)
    .then((response) => {
      if (!response) {
        return res.status(400).json({ message: "invalid project id" });
      } else {
        req.user = response;
        next();
      }
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
}

module.exports = router;
