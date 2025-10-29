import { NextFunction, Request, Response, Router } from "express";

const router = Router()


router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
    const { email, firstName, lastName, password, role } = req.body;
})