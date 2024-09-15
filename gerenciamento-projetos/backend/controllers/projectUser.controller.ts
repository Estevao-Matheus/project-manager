import { Request, Response } from "express";
import ProjectUser, { IProjectUser } from "../models/projectUserModel";


export const addUserToProject = async (req: Request, res: Response): Promise<void> => {
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


export const removeUserFromProject = async (req: Request, res: Response): Promise<void> => {
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


export const getUsersByProject = async (req: Request, res: Response): Promise<void> => {
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
