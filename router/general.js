const express = require('express');
const axios = require('axios');

let books = require("../booksdb.js");

const public_users = express.Router();


// TASK 1 - Get all books
public_users.get('/', async function (req, res) {

  try {

    const response = await axios.get('http://localhost:5000/books');

    return res.status(200).json(response.data);

  } catch (err) {

    return res.status(200).json(books);

  }

});


// Internal books route
public_users.get('/books', function (req, res) {

  return res.status(200).json(books);

});


// TASK 2 - Get book by ISBN
public_users.get('/isbn/:isbn', async function (req, res) {

  const isbn = req.params.isbn;

  try {

    const response = await axios.get('http://localhost:5000/books');

    const allBooks = response.data;

    if (!allBooks[isbn]) {

      return res.status(404).json({
        message: "Book not found"
      });

    }

    return res.status(200).json(allBooks[isbn]);

  } catch (err) {

    return res.status(500).json({
      message: "Error searching ISBN"
    });

  }

});


// TASK 3 - Get books by author
public_users.get('/author/:author', async function (req, res) {

  const author = req.params.author;

  try {

    const response = await axios.get('http://localhost:5000/books');

    const allBooks = response.data;

    const filteredBooks = Object.keys(allBooks)
      .filter(key =>
        allBooks[key].author.toLowerCase().includes(author.toLowerCase())
      )
      .reduce((obj, key) => {

        obj[key] = allBooks[key];

        return obj;

      }, {});

    // Error handling if no books found
    if (Object.keys(filteredBooks).length === 0) {

      return res.status(404).json({
        message: "No books found for the specified author"
      });

    }

    return res.status(200).json(filteredBooks);

  } catch (err) {

    return res.status(500).json({
      message: "Error searching author"
    });

  }

});


// TASK 4 - Get books by title
public_users.get('/title/:title', async function (req, res) {

  const title = req.params.title;

  try {

    const response = await axios.get('http://localhost:5000/books');

    const allBooks = response.data;

    const filteredBooks = Object.keys(allBooks)
      .filter(key =>
        allBooks[key].title.toLowerCase().includes(title.toLowerCase())
      )
      .reduce((obj, key) => {

        obj[key] = allBooks[key];

        return obj;

      }, {});

    // Error handling if no books found
    if (Object.keys(filteredBooks).length === 0) {

      return res.status(404).json({
        message: "No books found for the specified title"
      });

    }

    return res.status(200).json(filteredBooks);

  } catch (err) {

    return res.status(500).json({
      message: "Error searching title"
    });

  }

});


// TASK 5 - Get book reviews
public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  if (!books[isbn]) {

    return res.status(404).json({
      message: "Book not found"
    });

  }

  return res.status(200).json({
    reviews: books[isbn].reviews
  });

});


module.exports.general = public_users;
