import User from "../models/user.model";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export const checkUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, "5e6dd78f34a73ae256db6d1be9a6cdee410f33584ff9c7a7d105c6991f3f40cc", async (err: any, decodedToken: any) => {
            if (err) {
                res.json({ status: false });
                next();
            } else {
                const user = await User.findById(decodedToken.id);
                if (user) {
                    res.json({ status: true, user: user });
                } else {
                    res.json({ status: false });
                }
                next();
            }
        });
    } else {
        res.json({ status: false });
        next();
    }
}; 