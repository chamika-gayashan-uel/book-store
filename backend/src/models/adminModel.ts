import mongoose from "mongoose";
import { IUser, User } from "./userModel";

export interface IAdmin extends IUser {
    email: string
}


export const Admin = User.discriminator<IAdmin>("Admin", new mongoose.Schema({ _id: false }));
