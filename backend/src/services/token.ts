import { UserRole } from "../models/userModel";
import jwt from "jsonwebtoken";

export const generateToke = (payload: { userId: string, role: UserRole }) => {
    const token = jwt.sign(payload, String(process.env.JWT_SECRET ?? "BOOKSTOREAPP"), { expiresIn: 60 * 60 * 24 * 7 });
    return token;
}

export const verifyToken = (token: string) => {
    const payload = jwt.verify(token, String(process.env.JWT_SECRET ?? "BOOKSTOREAPP"));
    return payload as { userId: string, role: UserRole };
}