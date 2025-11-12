import mongoose, { Types, Document, Schema } from "mongoose";

export interface IWishlist extends Document {
    bookId: Types.ObjectId,
    transactionHash: String
}

export const wishlistSchema = new mongoose.Schema<IWishlist>({
    bookId: { type: Schema.Types.ObjectId, ref: "Book" },
    transactionHash: {
        type: String,
        required: true
    }
})

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);