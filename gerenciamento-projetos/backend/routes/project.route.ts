import express, { Router, Request, Response } from "express";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addUserToProject,
  removeUserFromProject,
  listUsersInProject,
} from "../controllers/project.controller";

const router: Router = express.Router();

interface AddUserRequest extends Request {
  body: {
    projetoId: string;
    userId: string;
  };
}

interface RemoveUserRequest extends Request {
  body: {
    projetoId: string;
    userId: string;
  };
}

router.post("/", (req: Request, res: Response) => createProject(req, res));

router.get("/", (req: Request, res: Response) => getProjects(req, res));

router.get("/:id", (req: Request, res: Response) => getProject(req, res));

router.put("/:id", (req: Request, res: Response) => updateProject(req, res));

router.delete("/:id", (req: Request, res: Response) => deleteProject(req, res));

router.post("/addUser", (req: AddUserRequest, res: Response) => addUserToProject(req, res));

router.post("/removeUser", (req: RemoveUserRequest, res: Response) => removeUserFromProject(req, res));

router.get("/:projetoId/usuarios", (req: Request, res: Response) => listUsersInProject(req, res));

export default router;
