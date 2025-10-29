import mongoose from "mongoose";

export type UserRole = "Admin" | "Member" | "Author";

export interface IUser extends Document {
    email: String,
    firstName: String,
    lastName: String,
    password: String,
    role: UserRole
}

const userSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true
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
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Admin", "Member", "Author"],
        required: true
    }
}, { timestamps: true });

userSchema.pre("save", async (next) => {
    const user = this as unknown as IUser;
    // if (!user.isSameNode("password"))
})

export const User = mongoose.model("User", userSchema);