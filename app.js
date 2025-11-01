const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

// MongoDB Connection - local database
const MONGODB_URI = 'mongodb://localhost:27017/bookstore';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Check connection
const db = mongoose.connection;
db.on('error', (error) => {
    console.error('❌ MongoDB connection error:', error);
});
db.once('open', function() {
    console.log('✅ Connected to MongoDB successfully!');
    console.log('📚 Database: bookstore');
});

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Routes
const bookRoutes = require('./routes/books');
app.use('/', bookRoutes);

// Home route
app.get('/', (req, res) => {
    res.render('index');
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 Online Bookstore is ready!`);
});