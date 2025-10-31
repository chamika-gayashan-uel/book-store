import mongoose from "mongoose";
import { IUser, User } from "./userModel";

export interface IMember extends IUser {
    email: string
}

export const Member = User.discriminator<IMember>("Member", new mongoose.Schema({ _id: false }));
