import { Request, Response } from "express";
import ProjectUser, { IProjectUser } from "../models/projectUser.model";
import Project from "../models/project.model";


export const addUserToProject = async (req: Request, res: Response): Promise<void> => {
  const { usuario_id, projeto_id } = req.body;

  try {
    const projectUser = new ProjectUser({ usuario_id, projeto_id });
    await projectUser.save();

    res.status(201).json({ message: "User added to project successfully" });
  } catch (error: any) {
    res
      .status(400)
      .json({ message: "Failed to add user to project", error: error.message });
  }
};


export const removeUserFromProject = async (req: Request, res: Response): Promise<void> => {
  const { usuario_id, projeto_id } = req.body;

  try {
    await ProjectUser.findOneAndDelete({ usuario_id, projeto_id });

    res.status(200).json({ message: "User removed from project successfully" });
  } catch (error: any) {
    res.status(400).json({
      message: "Failed to remove user from project",
      error: error.message,
    });
  }
};


export const getUsersByProject = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.params;

  try {
    const projectUsers = await ProjectUser.find({
      projeto_id: projectId,
    }).populate("usuario_id");

    res.status(200).json(projectUsers);
  } catch (error: any) {
    res.status(400).json({
      message: "Falha ao obter os usuários do projeto",
      error: error.message,
    });
  }
};

export const getProjectsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { nome, data_inicio, data_fim, status, page = 1, limit = 10 } = req.query;

    const query: any = { user: userId };

    if (nome) {
      query.nome = { $regex: nome, $options: 'i' };
    }
    if (data_inicio) {
      query.data_inicio = { $gte: new Date(data_inicio as string) };
    }
    if (data_fim) {
      query.data_fim = { $lte: new Date(data_fim as string) };
    }
    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const projects = await Project.find(query)
      .skip(skip)
      .limit(Number(limit));

    const totalProjects = await Project.countDocuments(query);
    const totalPages = Math.ceil(totalProjects / Number(limit));

    res.status(200).json({
      projects,
      totalProjects,
      totalPages,
      currentPage: Number(page),
      filters: req.query,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Falha ao obter os projetos por usuário' });
  }
};