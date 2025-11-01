const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Get all books
router.get('/books', async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.render('books', { books });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

// Show add book form
router.get('/books/add', (req, res) => {
    res.render('add-book');
});

// Add new book
router.post('/books', async (req, res) => {
    try {
        const { title, author, isbn, price, category, description, stock, imageUrl } = req.body;
        
        const newBook = new Book({
            title,
            author,
            isbn,
            price: parseFloat(price),
            category,
            description,
            stock: parseInt(stock),
            imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300'
        });

        await newBook.save();
        res.redirect('/books');
    } catch (error) {
        console.error(error);
        res.redirect('/books/add');
    }
});

// Show edit book form
router.get('/books/edit/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.redirect('/books');
        }
        res.render('edit-book', { book });
    } catch (error) {
        console.error(error);
        res.redirect('/books');
    }
});

// Update book
router.put('/books/:id', async (req, res) => {
    try {
        const { title, author, isbn, price, category, description, stock, imageUrl } = req.body;
        
        await Book.findByIdAndUpdate(req.params.id, {
            title,
            author,
            isbn,
            price: parseFloat(price),
            category,
            description,
            stock: parseInt(stock),
            imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300'
        });

        res.redirect('/books');
    } catch (error) {
        console.error(error);
        res.redirect(`/books/edit/${req.params.id}`);
    }
});

// Delete book
router.delete('/books/:id', async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.redirect('/books');
    } catch (error) {
        console.error(error);
        res.redirect('/books');
    }
});

// Search books
router.get('/books/search', async (req, res) => {
    try {
        const query = req.query.q;
        const books = await Book.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ]
        });
        res.render('books', { books, searchQuery: query });
    } catch (error) {
        console.error(error);
        res.redirect('/books');
    }
});

// Contact Us page
router.get('/contact', (req, res) => {
    res.render('contact');
});

// About Us page  
router.get('/about', (req, res) => {
    res.render('about');
});

// Feedback page
router.get('/feedback', (req, res) => {
    res.render('feedback');
});

// Categories page
router.get('/categories', async (req, res) => {
    try {
        const categories = await Book.distinct('category');
        const booksByCategory = {};
        
        for (let category of categories) {
            booksByCategory[category] = await Book.find({ category }).limit(4);
        }
        
        res.render('categories', { categories, booksByCategory });
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});

// Books by category
router.get('/categories/:category', async (req, res) => {
    try {
        const category = req.params.category;
        const books = await Book.find({ category });
        res.render('books', { books, category });
    } catch (error) {
        console.error(error);
        res.redirect('/categories');
    }
});

// Handle contact form submission
router.post('/contact', (req, res) => {
    // In a real app, you would save this to database or send email
    console.log('Contact form submitted:', req.body);
    res.redirect('/contact?success=true');
});

// Handle feedback submission
router.post('/feedback', (req, res) => {
    // In a real app, you would save this to database
    console.log('Feedback submitted:', req.body);
    res.redirect('/feedback?success=true');
});

module.exports = router;