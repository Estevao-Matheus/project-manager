const Project = require("../models/project.model.js");
const User = require("../models/user.model.js");
const ProjetosUsuarios = require("../models/projectUser.model.js");

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    res.status(200).json(projects);
  } catch (error) {
    rest.status(500).json({ message: error.message });
  }
};

const getProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "projeto não encontrado" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndUpdate(id, req.body);

    if (!project) {
      return res.status(404).json({ message: "projeto não encontrado" });
    }

    const updatedProject = await Project.findById(id);

    res.status(200).json(updatedProject);
  } catch (error) {
    rest.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ message: "projeto não encontrado" });
    }

    res.status(200).json("Projeto deletado com sucesso!");
  } catch (error) {
    rest.status(500).json({ message: error.message });
  }
};

const addUserToProject = async (req, res) => {
  try {
    const { projetoId, userId } = req.body;

    const existingRelation = await ProjetosUsuarios.findOne({
      projeto_id: projetoId,
      usuario_id: userId,
    });
    if (existingRelation) {
      return res
        .status(400)
        .json({ message: "Usuário já está associado a este projeto" });
    }

    const newRelation = new ProjetosUsuarios({
      projeto_id: projetoId,
      usuario_id: userId,
    });
    await newRelation.save();

    res.status(200).json(newRelation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeUserFromProject = async (req, res) => {
  try {
    const { projetoId, userId } = req.body;

    const relation = await ProjetosUsuarios.findOneAndDelete({
      projeto_id: projetoId,
      usuario_id: userId,
    });
    if (!relation) {
      return res.status(404).json({ message: "Relação não encontrada" });
    }

    res.status(200).json({ message: "Usuário removido do projeto" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const listUsersInProject = async (req, res) => {
  try {
    const { projetoId } = req.params;

    const relations = await ProjetosUsuarios.find({
      projeto_id: projetoId,
    }).populate("usuario_id", "nome email papel");
    const users = relations.map((relation) => relation.usuario_id);

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addUserToProject,
  removeUserFromProject,
  listUsersInProject,
};
