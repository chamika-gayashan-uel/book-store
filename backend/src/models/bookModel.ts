import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IBook extends Document {
  title: string,
  isbn?: string,
  price: number,
  category: string,
  description?: string,
  publisher?: string,
  publicationYear?: string,
  pages?: string,
  language?: string,
  // coverImage?: string,
  inStock: boolean,
  rating: number,
  author: Types.ObjectId
}

const bookSchema = new mongoose.Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
    },
    price: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    description: {
      type: String,
    },
    publisher: {
      type: String,
    },
    publicationYear: {
      type: String
    },
    language: {
      type: String,
    },
    pages: {
      type: String,
    },
    // coverImage: {
    //   type: String,
    // },
    inStock: {
      type: Boolean,
      default: true
    },
    rating: {
      type: Number,
      default: 5
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true,
  }
);

export const Book = mongoose.model('Book', bookSchema);
