import { Router, Request, Response, NextFunction } from "express";
import { Admin } from "../models/adminModel";
import { generateToke } from "../services/token";
import { User } from "../models/userModel";
import { authenticate } from "../middleware/authenticate";

const router = Router();

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await Admin.findOne({ email: email });
        if (!user) return next(Error("Invalid Email Address"));

        const isValid = await user?.comparePassword(password);

        if (!isValid) return next(Error("Invalid Password"));

        const token = generateToke({ userId: user.id, role: user.role });

        res.status(200).json({
            success: true,
            token
        })
    } catch (error) {
        next(error);
    }
});

router.get("/", authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);

        if (!user) return next(Error("User not found"));

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        next(error);
    }
});

router.put("/update", authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, profileImage, walletAddress, isActive, userId } = req.body;

        await User.findByIdAndUpdate(
            userId, {
            firstName,
            lastName,
            profileImage,
            walletAddress,
            isActive
        });

        const updatedUser = await User.findById(userId);

        res.status(200).json({
            success: true,
            user: updatedUser
        });

    } catch (error) {
        next(error);
    }
});

export default router;