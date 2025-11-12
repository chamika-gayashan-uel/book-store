import { NextFunction, Request, Response, Router } from "express";
import { Admin } from "../models/adminModel";

const router = Router()

router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, firstName, lastName, password } = req.body;

        if (!email || !firstName || !lastName || !password) return next(Error("Required fields not found"))

        const newUser = {
            email, firstName, lastName, password
        }

        const user = await Admin.create(newUser);

        res.status(201).json({
            success: true,
            user: user
        })

    } catch (error) {
        next(error);
    }
})

export default router;