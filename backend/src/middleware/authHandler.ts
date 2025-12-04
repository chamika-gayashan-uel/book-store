import { NextFunction, Request, Response, } from "express";
import { verifyToken } from "../services/token";

export const authHandler = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorization = req.headers['authorization'];
        if (!authorization) return next(Error("Unauthorized"))

        const token = authorization.split(" ")[1];
        const payload = verifyToken(token);

        req.body.userId = payload.userId;
        req.body.role = payload.role

        next();
    } catch (error) {
        next(error);
    }
}