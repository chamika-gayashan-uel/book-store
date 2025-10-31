import { NextFunction, Request, Response, Router } from "express";
import { Author } from "../models/authorModel";

const router = Router()


router.post("/create", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, about } = req.body;

        if (!firstName || !lastName) return next(Error("Required fields not found"))

        const newAuthor = {
            firstName, lastName, about
        }

        const user = await Author.create(newAuthor);

        res.status(201).json({
            success: true,
            user: user
        })

    } catch (error) {
        next(error);
    }
})

export default router;