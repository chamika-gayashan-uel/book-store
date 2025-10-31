import { UserRole } from "../models/userModel";
import jwt from "jsonwebtoken";

export const generateToke = (payload: { userId: string, role: UserRole }) => {
    const token = jwt.sign(payload, String(process.env.JWT_SECRET ?? "BOOKSTOREAPP"), { expiresIn: 60 * 15 });
    return token;
}