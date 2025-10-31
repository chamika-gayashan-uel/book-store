import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IBook extends Document {
  name: string;
  description: string;
  price?: number;
  publishedYear: Date;
  author: Types.ObjectId
}

const bookSchema = new mongoose.Schema<IBook>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    publishedYear: {
      type: Date,
      required: true
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
