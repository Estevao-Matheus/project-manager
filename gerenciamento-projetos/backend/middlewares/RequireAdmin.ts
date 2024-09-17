import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

interface JwtPayload {
    id: string;
}

const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: "Você deve estar logado para acessar esta rota" });
    }

    try {
        const decoded = jwt.verify(token, "5e6dd78f34a73ae256db6d1be9a6cdee410f33584ff9c7a7d105c6991f3f40cc") as JwtPayload;
        const user = await User.findById(decoded.id);

        if (!user || user.papel !== "Administrador") {
            return res.status(403).json({ message: "Acesso negado" });
        }

        next();
    } catch (err) {
        res.status(401).json({ message: "Token inválido" });
    }
};

export default requireAdmin;
