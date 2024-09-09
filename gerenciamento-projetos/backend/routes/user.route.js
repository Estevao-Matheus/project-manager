const express = require("express");
const authController = require("../controllers/user.controller");
const {
  login,
  logout,
  register,
  deleteUser,
} = require("../controllers/user.controller");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.delete("/user/delete/:id", deleteUser);

module.exports = router;
