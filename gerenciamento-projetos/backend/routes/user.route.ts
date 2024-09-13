import { Router } from "express";
import {
  login,
  logout,
  register,
  deleteUser,
  listAllUsers
} from "../controllers/user.controller";


const router: Router = Router();


router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.delete("/user/delete/:id", deleteUser);
router.get("/users", listAllUsers);

export default router;