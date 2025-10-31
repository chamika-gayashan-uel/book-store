import { NextFunction, Request, Response, Router } from "express";
import { generateToke } from "../services/token";
import { Member } from "../models/memberModel";

const router = Router()

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await Member.findOne({ email: email });
        if (!user) return next(Error("Invalid Email Address"));

        const isValid = await user?.comparePassword(password);

        if (!isValid) return next(Error("Invalid Password"));

        const token = generateToke({ userId: user.id, role: user.role });

        res.send(200).json({
            success: true,
            token
        })
    } catch (error) {
        next(error);
    }
})
export default router;