import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandle';
import booksRoute from './routes/booksRoute';

const app = express();

dotenv.config();

app.use(express.json());

app.use(cors());

app.use(booksRoute)

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
