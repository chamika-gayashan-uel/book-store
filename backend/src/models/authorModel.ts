import mongoose from "mongoose";
import { IUser, User } from "./userModel";

export interface IAuthor extends IUser {
    authorBio: string,
}

export const authorSchema = new mongoose.Schema<IAuthor>({
    authorBio: {
        type: String,
        required: false
    },
})

export const Author = User.discriminator<IAuthor>("Author", authorSchema);
