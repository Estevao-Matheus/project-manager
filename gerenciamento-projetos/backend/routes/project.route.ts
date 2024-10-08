import express, { Router, Request, Response, NextFunction } from "express";
import csrf from "csurf"; // Importando o csurf
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addUserToProject,
  removeUserFromProject,
  listUsersInProject,
  getProjectsPaginated,
  getProjectsByStatus
} from "../controllers/project.controller";

import { getProjectsByUser } from "../controllers/projectUser.controller";

const router: Router = express.Router();

const csrfProtection = csrf({ cookie: true }); // Middleware de proteção CSRF

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

router.get('/paginated', (req: Request, res: Response) => getProjectsPaginated(req, res));

router.get("/status-count", getProjectsByStatus);

router.put("/:id", (req: Request, res: Response) => updateProject(req, res));

router.delete("/:id", (req: Request, res: Response) => deleteProject(req, res));

// Aplicando a proteção CSRF apenas na rota getProject
router.get("/:id", csrfProtection, getProject);

router.post("/addUser", (req: AddUserRequest, res: Response) => addUserToProject(req, res));

router.post("/removeUser", (req: RemoveUserRequest, res: Response) => removeUserFromProject(req, res));

router.get("/:projetoId/usuarios", (req: Request, res: Response) => listUsersInProject(req, res));

router.get("/:userId/projects", (req: Request, res: Response) => getProjectsByUser(req, res));

export default router;
