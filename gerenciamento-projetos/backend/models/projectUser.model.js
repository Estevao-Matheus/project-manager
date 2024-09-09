const mongoose = require("mongoose");

const projectUserSchema = new mongoose.Schema({
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  projeto_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
});

const ProjectUser = mongoose.model("ProjectUser", projectUserSchema);

module.exports = ProjectUser;
