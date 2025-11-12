import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/token';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const auth = req.headers['authorization'];

        if (!auth) return next(Error("Unauthorized"));

        const token = auth.split(" ")[1];

        const payload = verifyToken(token);

        req.body = { ...req.body, userId: payload.userId, role: payload.role };

        next();
    } catch (error) {
        next(error);
    }
}