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
  errors?: any;
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
  try {
    const { email, senha } = req.body;
    const user: IUser = await User.login(email, senha);
    const token = createToken(user._id);

    res.cookie("jwt", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV !== 'development', // Set to true in production
      sameSite: 'strict',
      maxAge: maxAge * 1000
    })

    res.set("Access-Control-Allow-Credentials", "true");
    // res.set('jwt', token);
    // res.set('Access-Control-Expose-Headers', 'jwt');

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
  res.cookie("jwt", "", {
    httpOnly: false,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 1
  });
  res.set("Access-Control-Allow-Credentials", "true");
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

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const { nome, email, senha, papel } = req.body;

    const user = await User.findByIdAndUpdate(userId, req.body, { new: true });

    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }
    res.status(200).json({ message: "Usuário atualizado com sucesso! API", user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }

}


export const listAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ message: "Falha ao obter os usuarios", error: err.message });
  }
};

export const listAllUsersPaginated = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filters: { [key: string]: any } = {};
    if (req.query.papel) {
      filters.papel = req.query.papel;
    }
    if (req.query.email) {
      filters.email = new RegExp(req.query.email as string, "i");
    }
    if (req.query.nome) {
      filters.nome = new RegExp(req.query.nome as string, "i");
    }

    const users = await User.find(filters)
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(filters);

    res.status(200).json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Erro na consulta de paginação",
      error: error.message
    });
  }
};


export const getUsersByRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const allRoles = ["Desenvolvedor", "Administrador", "Usuario"];

    const result = await User.aggregate([
      {
        $group: {
          _id: "$papel",
          count: { $sum: 1 },
        },
      },
    ]);

    const rolesCount = allRoles.map(role => ({
      _id: role,
      count: 0
    }));

    result.forEach((role: any) => {
      const index = rolesCount.findIndex(r => r._id === role._id);
      if (index !== -1) {
        rolesCount[index].count = role.count;
      }
    });


    const totalUsers = await User.countDocuments();


    rolesCount.unshift({
      _id: "Total de Usuários",
      count: totalUsers
    });


    res.status(200).json(rolesCount);
  } catch (err: any) {
    res.status(500).json({ message: "Falha ao obter os usuários", error: err.message });
  }
};