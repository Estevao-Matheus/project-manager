import { Router } from "express";
import {
  login,
  logout,
  register,
  deleteUser,
  listAllUsers,
  listAllUsersPaginated,
  getUsersByRole
} from "../controllers/user.controller";

import { checkUser } from "../middlewares/AuthMiddleWare";
import requireAdmin from "../middlewares/RequireAdmin";

const router: Router = Router();

router.post("/verify", checkUser);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.delete("/user/:id", requireAdmin, deleteUser);
router.get("/users", listAllUsers);
router.get("/users/paginated", listAllUsersPaginated);
router.get("/users/role-count", getUsersByRole);

export default router;