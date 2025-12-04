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
    const coverImage = req.file?.path;

    if (
      !title || !category || !price) {
      return res.status(400).send({
        message: 'Send all required fields',
      });
    }

    const newBook = { title, isbn, category, price, publisher, publicationYear, pages, language, description, coverImage, author: userId };

    const book = await Book.create(newBook);

    if (coverImage) {
      const uploadsDir = path.join(__dirname, "..", "uploads");

      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      const fileName = book._id;
      const coverImagePath = path.join(uploadsDir, fileName);

      fs.copyFileSync(coverImage, coverImagePath);
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
router.put('/:id', async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear
    ) {
      return response.status(400).send({
        message: 'Send all required fields: title, author, publishYear',
      });
    }

    const { id } = request.params;

    const result = await Book.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).json({ message: 'Book not found' });
    }

    return response.status(200).send({ message: 'Book updated successfully' });
  } catch (error: any) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
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
