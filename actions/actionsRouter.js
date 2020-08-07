const express = require("express");
const Actions = require("../data/helpers/actionModel");
const Projects = require("../data/helpers/projectModel");

const router = express.Router();

router.get("/", (req, res) => {
  Actions.get()
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

  Projects.getProjectActions(requestedProjectID)
    .then((response) => {
      res.status(200).json({ response });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "there was an error while retrieving the project" });
    });
});

router.post("/:id", validateProjectID, validateAction, (req, res) => {
  let newProject = req.body;

  Actions.insert(newProject)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "there was an issue while creating the action" });
    });
});

router.put("/:id/:actionID", validateProjectID, validateAction, (req, res) => {
  let udpatedAction = req.body;
  let requestedActionID = req.params.actionID;

  Actions.update(requestedActionID, udpatedAction)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "there was an issue while creating the project" });
    });
});

router.delete(
  "/:id/:actionID",
  validateProjectID,
  validateActionID,
  (req, res) => {
    let requestedActionID = req.params.actionID;

    Actions.remove(requestedActionID)
      .then((response) => {
        if (response === 0) {
          res.status(500).json({
            error: `there was an issue while deleting action with ID ${requestedActionID}`,
          });
        } else {
          res.status(200).json({
            message: `the action with ID ${requestedActionID} has been deleted`,
          });
        }
      })
      .catch((error) => {
        res
          .status(500)
          .json({ error: "there was an issue while deleting the action" });
      });
  }
);

function validateAction(req, res, next) {
  req.body.project_id = req.params.id;

  if (!req.body) {
    return res.status(400).json({ message: "missing user data" });
  } else if (!req.body.project_id) {
    return res
      .status(400)
      .json({ message: "missing required project_id field" });
  } else if (!req.body.description) {
    return res
      .status(400)
      .json({ message: "missing required description field" });
  } else if (!req.body.completed) {
    return res
      .status(400)
      .json({ message: "missing required completed field" });
  } else if (!req.body.notes) {
    return res.status(400).json({ message: "missing required notes field" });
  } else {
    next();
  }
}

function validateActionID(req, res, next) {
  let requestedActionID = req.params.actionID;

  Actions.get(requestedActionID)
    .then((response) => {
      if (!response) {
        return res.status(400).json({ message: "invalid action id" });
      } else {
        req.user = response;
        next();
      }
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message });
    });
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
