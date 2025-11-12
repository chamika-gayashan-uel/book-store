import mongoose from "mongoose";
import bcrypt from "bcrypt"

export type UserRole = "Admin" | "Member" | "Author";

export interface IUser extends Document {
    email?: string,
    firstName: string,
    lastName: string,
    password?: string,
    role: UserRole,
    profileImage?: string,
    walletAddress: string,
    isActive: boolean,
    comparePassword(password: string): Promise<boolean>
}

const userSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        unique: true,
        lowercase: true,
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    profileImage: {
        type: String,
    },
    walletAddress: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    role: {
        type: String,
        enum: ["Admin", "Member", "Author"],
        required: true
    },
}, { discriminatorKey: "role", timestamps: true });


userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(String(this.password), salt)
        next();
    } catch (error: any) {
        next(error)
    }
})

userSchema.methods.comparePassword = async function (password: string) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
}

export const User = mongoose.model<IUser>("User", userSchema);