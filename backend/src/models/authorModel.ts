import mongoose from "mongoose";
import { IUser, User } from "./userModel";

export interface IAuthor extends IUser {
    about: string,
}

export const authorSchema = new mongoose.Schema<IAuthor>({
    about: {
        type: String,
        required: false
    },
})

export const Author = User.discriminator<IAuthor>("Author", authorSchema);
