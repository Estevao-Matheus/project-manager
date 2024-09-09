const express = require("express");
const router = express.Router();
const Project = require("../models/project.model.js");
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addUserToProject,
  removeUserFromProject,
  listUsersInProject,
} = require("../controllers/project.controller.js");

router.post("/", createProject);

router.get("/", getProjects);

router.get("/:id", getProject);

router.put("/:id", updateProject);

router.delete("/:id", deleteProject);

router.post("/addUser", addUserToProject);

router.post("/removeUser", removeUserFromProject);

router.get("/:projetoId/usuarios", listUsersInProject);

module.exports = router;
