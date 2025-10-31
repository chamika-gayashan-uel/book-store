import mongoose, { Document, Schema, Types } from "mongoose";

export interface IRefreshToken extends Document {
    tokenHash: string,
    expireAt: Date,
    isRevoked: boolean,
    replacedHash: string,
    userId: Types.ObjectId
}

const refreshTokenSchema = new mongoose.Schema<IRefreshToken>({
    tokenHash: {
        type: String,
        required: true,
        unique: true
    },
    expireAt: {
        type: Date,
        required: true
    },
    isRevoked: {
        type: Boolean,
        required: true
    },
    replacedHash: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    }
}, { timestamps: true })