const express = require('express');
const { connectToDb, getDb } = require('./db');


// init app & middleware
const app = express();

// db connection
let db;

connectToDb((error) => {
    if (!error) {
        app.listen(5998, () => {
            console.log('Application listening on PORT: 5998');
        })
        db = getDb();
    }
})

// routes
app.get('/books', (req, res) => {
    let books = [];

    db.collection('books')
        .find()
        .sort({ author: 1 })
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books);
        })
        .catch(() => {
            res.status(500).json({ Error: 'Unable to fetch the documents' });
        })

})