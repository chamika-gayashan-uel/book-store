import mongoose, { Types, Document, Schema } from "mongoose";

export interface IReview extends Document {
    comment: String,
    rating: number,
    book: Types.ObjectId,
    member: Types.ObjectId
};

export const reviewSchema = new mongoose.Schema<IReview>({
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    book: Schema.Types.ObjectId,
    member: Schema.Types.ObjectId
})

export const Review = mongoose.model("Review", reviewSchema);