import express, { Request, Response, NextFunction } from 'express';
import { Book } from '../models/bookModel';
import multer from 'multer'
import { authHandler } from '../middleware/authHandler';
import path from 'path';
import fs from "fs";

// const storage = multer.diskStorage({
//   destination: "./uploads/",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   }
// });

// const upload = multer({ storage });

const router = express.Router();

// Route for Save a new Book
router.post('/create', authHandler, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, isbn, category, price, publisher, publicationYear, pages, language, description, userId } = req.body;

    if (
      !title || !category || !price) {
      return res.status(400).send({
        message: 'Send all required fields',
      });
    }

    const newBook = { title, isbn, category, price, publisher, publicationYear, pages, language, description, author: userId };

    const book = await Book.create(newBook);

    if (req.body.coverImage) {
      const buffer = Buffer.from(req.body.coverImage, "base64");
      fs.writeFileSync(`uploads/${book._id}.jpg`, buffer);
    }

    return res.status(201).json({
      success: true,
      book
    });

  } catch (error: any) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route for Get All Books from database
router.get('/', async (request, response) => {
  try {
    const books = await Book.find()
      .select("coverImage price title")
      .populate("author", "email firstName lastName")
      .exec();

    return response.status(200).json({
      books,
    });
  } catch (error: any) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Get One Book from database by id
router.get('/:id', authHandler, async (request, response) => {
  try {
    const { id } = request.params;

    const book = await Book.findById(id).populate("author", "firstName lastName")
      .exec();

    return response.status(200).json({
      success: true,
      book
    });
  } catch (error: any) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Route for Update a Book
router.put('/update/:id', authHandler, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, isbn, category, price, publisher, publicationYear, pages, language, description, userId } = req.body;

    if (
      !title || !category || !price) {
      return res.status(400).send({
        message: 'Send all required fields',
      });
    }

    const _book = await Book.findByIdAndUpdate(id, { title, isbn, category, price, publisher, publicationYear, pages, language, description })

    if (req.body.coverImage && _book) {
      const buffer = Buffer.from(req.body.coverImage, "base64");
      fs.writeFileSync(`uploads/${_book._id}.jpg`, buffer);
    }

    return res.status(201).json({
      success: true,
      _book
    });

  } catch (error: any) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Route for Delete a book
router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Book.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: 'Book not found' });
    }

    return response.status(200).send({ message: 'Book deleted successfully' });
  } catch (error: any) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;
