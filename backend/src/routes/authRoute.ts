import { NextFunction, Request, Response, Router } from "express";
import { generateToke } from "../services/token";
import { Member } from "../models/memberModel";
import { User } from "../models/userModel";
import { Admin } from "../models/adminModel";
import { Author } from "../models/authorModel";
import { authHandler } from "../middleware/authHandler";

const router = Router()

router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, firstName, lastName, role } = req.body;

        if (!email || !password || !firstName || !lastName || !role) return next(Error("Required fields not found"));

        const _user = await Member.findOne({ email: email });

        if (_user) return next(Error("User already exist"));

        const newUser = {
            email, password, firstName, lastName
        }

        let user;

        if (role == "admin") {
            user = await Admin.create(newUser);
        } else if (role == 'author') {
            user = await Author.create(newUser);
        } else {
            user = await Member.create(newUser);
        }

        res.status(201).json({
            success: true,
            user: user
        })

    } catch (error) {
        console.log(error)
        next(error);
    }
})

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return next(Error("Invalid Email Address"));

        const isValid = await user.comparePassword(password);
        if (!isValid) return next(Error("Invalid Password"));

        const token = generateToke({ userId: user.id, role: user.role });

        return res.status(200).json({
            success: true,
            token
        });

    } catch (error) {
        console.log(error)
        next(error);
    }
})

router.get("/get-user", authHandler, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, role } = req.body

        const user = await User.findById(userId);

        if (!user) return next(Error("User not found"));

        res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        next(error)
    }

});

router.post("/update-user", authHandler, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, email, address, phone, userId, role } = req.body;

        const newUserData = { firstName, lastName, email, address, phone };

        const newUser = await User.findByIdAndUpdate(userId, newUserData, { new: true });

        if (!newUser) return next(Error("User not found"));

        res.status(200).json({
            success: true,
            user: newUser
        });

    } catch (error) {
        next(error)
    }
});

export default router;