const ProjectUser = require("../models/projectUserModel");
const User = require("../models/userModel");
const Project = require("../models/projectModel");

// Add a user to a project
module.exports.addUserToProject = async (req, res) => {
  const { usuario_id, projeto_id } = req.body;

  try {
    const projectUser = new ProjectUser({ usuario_id, projeto_id });
    await projectUser.save();

    res.status(201).json({ message: "User added to project successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to add user to project", error: error.message });
  }
};

// Remove a user from a project
module.exports.removeUserFromProject = async (req, res) => {
  const { usuario_id, projeto_id } = req.body;

  try {
    await ProjectUser.findOneAndDelete({ usuario_id, projeto_id });

    res.status(200).json({ message: "User removed from project successfully" });
  } catch (error) {
    res.status(400).json({
      message: "Failed to remove user from project",
      error: error.message,
    });
  }
};

// Get all users related to a specific project
module.exports.getUsersByProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    const projectUsers = await ProjectUser.find({
      projeto_id: projectId,
    }).populate("usuario_id");

    res.status(200).json(projectUsers);
  } catch (error) {
    res.status(400).json({
      message: "Failed to get users for project",
      error: error.message,
    });
  }
};
