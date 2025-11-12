import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandle';
import booksRoute from './routes/booksRoute';
import adminUserRoute from './routes/adminUserRoute';
import authorRoute from './routes/authorUserRoute';
import userRoute from './routes/userRoute';

const app = express();

dotenv.config();

app.use(express.json());

app.use(cors());

app.use("book", booksRoute)
app.use("/admin", adminUserRoute)
app.use("/author", authorRoute)
app.use("/user", userRoute)

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
