import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model"; // Assuming you have a user model with types

const maxAge = 3 * 24 * 60 * 60; // 3 days

const createToken = (id: any): string => {
  return jwt.sign(
    { id },
    "5e6dd78f34a73ae256db6d1be9a6cdee410f33584ff9c7a7d105c6991f3f40cc",
    { expiresIn: maxAge }
  );
};

interface ErrorWithCode extends Error {
  code?: number;
  errors?: any; // Use `any` for simplicity
}

const handleErrors = (err: ErrorWithCode) => {
  let errors: { [key: string]: string } = { email: "", senha: "" };

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

  if (err.message.includes("Validação de usuário falhou") && err.errors) {
    Object.values(err.errors).forEach((error: any) => {
      const path = error.properties?.path;
      const message = error.properties?.message;
      if (path && message && path in errors) {
        errors[path] = message;
      }
    });
  }

  return errors;
};


export const register = async (req: Request, res: Response): Promise<void> => {
  const { nome, email, senha, papel } = req.body;

  try {
    const user: IUser = await User.create({ nome, email, senha, papel });
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
    const errors = handleErrors(err as ErrorWithCode);
    res.status(400).json({ errors, created: false });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, senha } = req.body;

  try {
    const user: IUser = await User.login(email, senha);
    const token = createToken(user._id);

    res.set('jwt', token);
    res.set('Access-Control-Expose-Headers', 'jwt');

    res.status(200).json({
      message: "Login realizado com sucesso! API",
      user: user._id,
      status: true,
    });
  } catch (err) {
    const errors = handleErrors(err as ErrorWithCode);
    res.status(400).json({ errors, status: false });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({ message: "Logged out com sucesso" });
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      res.status(404).json({ message: "Usuario não encontrado" });
      return;
    }

    res.status(200).json({ message: "Usuario deletado com sucesso" });
  } catch (err: any) {
    res.status(500).json({ message: "Falha ao deletar o usuario", error: err.message });
  }
};

export const listAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ message: "Falha ao obter os usuarios", error: err.message });
  }
};
