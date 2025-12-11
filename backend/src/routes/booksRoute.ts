import express, { Request, Response, NextFunction } from 'express';
import { Book } from '../models/bookModel';
import { Purchases } from '../models/purchaseModel';
import { authHandler } from '../middleware/authHandler';
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

    // const contractResponse = await mintBook({ _title: title, _bookId: crypto.randomUUID(), _price: price, _royalty: "10", WALLET_ADDRESS: address });

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

router.post('/delete', authHandler, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, id } = req.body;

    if (
      !id) {
      return res.status(400).send({
        message: 'Send all required fields',
      });
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(400).send({
        message: 'Book not found',
      });
    }

    if (book.author != userId) {
      return res.status(400).send({
        message: 'Unauthorized user',
      });
    }

    fs.rmSync(`uploads/${book._id}.jpg`);

    await Book.findByIdAndDelete(id)

    return res.status(201).json({
      success: true,
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

router.post('/purchase', authHandler, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId, userId } = req.body;
    if (!bookId) {
      res.status(400).json({
        message: "Required fields not found"
      });
    }

    const newPurchase = { book: bookId, buyer: userId };

    const purchase = await Purchases.create(newPurchase)

    res.status(200).json({
      success: true,
      purchase
    });

  } catch (error: any) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
})

router.post('/purchase-delete', authHandler, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, userId } = req.body;

    if (!id) {
      res.status(400).json({
        message: "Required fields not found"
      });
    }
    const purchase = await Purchases.findById(id);

    if (!purchase) {
      return res.status(400).json({
        message: "License not found for this purchase"
      });
    }

    if (purchase.buyer != userId) {
      return res.status(400).json({
        message: "License not found for this purchase"
      });
    }

    await Purchases.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
    });

  } catch (error: any) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
})

export default router;
