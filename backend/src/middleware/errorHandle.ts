import { NextFunction, Request, Response, } from "express";
import { Error } from "mongoose";

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(error.stack);
    res.status(400).json({
        "success": false,
        "message": error.message ?? "Something went wrong",
    })
}