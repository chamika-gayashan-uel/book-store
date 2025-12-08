import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandle';
import booksRoute from './routes/booksRoute';
import adminUserRoute from './routes/adminUserRoute';
import authorRoute from './routes/authorUserRoute';
import authRoute from './routes/authRoute';
import blockchainRoute from './routes/blockchainRoute';
import path from "path";

const app = express();

dotenv.config();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json({ limit: "1mb" }));

app.use(express.json());

app.use(cors());

app.use("/book", booksRoute)
app.use("/admin", adminUserRoute)
app.use("/author", authorRoute)
app.use("/auth", authRoute)
app.use("/blockchain", blockchainRoute)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(errorHandler)

mongoose
  .connect(process.env.MONGO_URL ?? '')
  .then(() => {
    console.log('App connected to database');
    app.listen(process.env.PORT, () => {
      console.log(`App is listening to port: http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
