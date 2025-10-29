import mongoose, { Types, Document, Schema } from "mongoose";

export interface IWishlist extends Document {
    books: Types.ObjectId[],
    member: Types.ObjectId
}

export const wishlistSchema = new mongoose.Schema<IWishlist>({
    books: [{ type: Schema.Types.ObjectId, ref: "Book" }],
    member: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);