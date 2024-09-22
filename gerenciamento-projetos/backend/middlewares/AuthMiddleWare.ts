import User from "../models/user.model";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export const checkUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ status: false });
    }

    jwt.verify(token, "5e6dd78f34a73ae256db6d1be9a6cdee410f33584ff9c7a7d105c6991f3f40cc", async (err: any, decodedToken: any) => {
        if (err) {
            return res.status(403).json({ status: false }); // Unauthorized
        }

        const user = await User.findById(decodedToken.id);

        if (user) {
            return res.status(200).json({ status: true, user });
        } else {
            return res.status(404).json({ status: false }); // User not found
        }
    });
};