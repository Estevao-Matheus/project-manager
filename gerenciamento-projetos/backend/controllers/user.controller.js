const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign(
    { id },
    "5e6dd78f34a73ae256db6d1be9a6cdee410f33584ff9c7a7d105c6991f3f40cc",
    { expiresIn: maxAge }
  );
};

const handleErrors = (err) => {
  let errors = { email: "", senha: "" };

  if (err.message === "email incorreto") {
    errors.email = "Esse email já foi registrado";
  }

  if (err.message === "senha incorreta") {
    errors.senha = "Senha Incorreta";
  }

  if (err.code === 11000) {
    errors.email = "Email já registrado";
    return errors;
  }

  if (err.message.includes("Validação de usuário falhou")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const register = async (req, res) => {
  const { nome, email, senha, papel } = req.body;

  try {
    const user = await User.create({ nome, email, senha, papel });
    const token = createToken(user._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    res.status(201).json({
      msg: "Usuário Criado com sucesso!",
      user: user._id,
      created: true,
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors, created: false });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.login(email, senha);
    const token = createToken(user._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    res.status(200).json({ user: user._id, status: true });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors, status: false });
  }
};

const logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({ message: "Logged out com sucesso" });
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario não encontrado" });
    }

    res.status(200).json({ message: "Usuario deletado com sucesso" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Falha ao deletar o usuario", error: err.message });
  }
};

const listAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Falha ao obter os usuarios", error: err.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  deleteUser,
  listAllUsers
};
