import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPurchases extends Document {
  buyer: Types.ObjectId,
  book: Types.ObjectId,
  quantity: number,
}

const purchasesSchema = new mongoose.Schema<IPurchases>(
  {
    buyer: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    book: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true,
  }
);

export const Purchases = mongoose.model('Purchases', purchasesSchema);
