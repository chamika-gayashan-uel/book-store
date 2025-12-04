import { NextFunction, Request, Response, Router } from "express";
import mongoose from "mongoose";
import { Admin, IAdmin } from "../models/adminModel";
import { generateToke } from "../services/token";
import { Member } from "../models/memberModel";

const router = Router()


router.post("/create-user", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, firstName, lastName, password } = req.body;

        if (!email || !firstName || !lastName || !password) return next(Error("Required fields not found"))

        const newUser = {
            email, firstName, lastName, password
        }

        const user = await Member.create(newUser);

        res.status(201).json({
            success: true,
            user: user
        })

    } catch (error) {
        next(error);
    }
})

// router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { email, password } = req.body;
//         const user = await Admin.findOne({ email: email });
//         if (!user) return next(Error("Invalid Email Address"));

//         const isValid = await user?.comparePassword(password);

//         if (!isValid) return next(Error("Invalid Password"));

//         const token = generateToke({ userId: user.id, role: user.role });

//         res.send(200).json({
//             success: true,
//             token
//         })
//     } catch (error) {
//         next(error);
//     }
// })
export default router;