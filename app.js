const express = require('express');
const { ObjectId } = require('mongodb');
const { connectToDb, getDb } = require('./db');


// init app & middleware
const app = express();
app.use(express.json());

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
    // current page pagination
    const page = req.query.p || 0;
    const booksPerPage = 2;
    
    let books = [];

    db.collection('books')
        .find()
        .sort({ author: 1 })
        .skip(page * booksPerPage)
        .limit(booksPerPage)
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books);
        })
        .catch(() => {
            res.status(500).json({ Error: 'Unable to fetch the documents' });
        })
})

app.get('/books/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
        .findOne({ _id: new ObjectId(req.params.id) })
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({ Error: 'Unable to fetch the documents' });
        })
    } else {
        res.status(500).json({ Error: 'The client id is not valid.' });
    }    
})

app.post('/books', (req, res) => {
    const book = req.body;

    db.collection('books')
        .insertOne(book)
        .then(result => {
            res.status(201).json(result);
        })
        .catch(error => {
            res.status(500).json({ error: 'Unable to create new document.'});
        })
})

app.delete('/books/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
        .deleteOne({ _id: new ObjectId(req.params.id) })
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({ Error: 'Could not delete the document.' });
        })
    } else {
        res.status(500).json({ Error: 'The client id is not valid.' });
    }    
})

app.patch('/books/:id', (req, res) => {
    const updates = req.body;

    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
        .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates })
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({ Error: 'Could not update the document.' });
        })
    } else {
        res.status(500).json({ Error: 'The client id is not valid.' });
    }    
})