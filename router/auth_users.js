const express = require('express');
const jwt = require('jsonwebtoken');

let books = require("../booksdb.js");

const authenticatedUser = express.Router();

let users = [];


// Check if user exists
const isValid = (username) => {
  return users.some(user => user.username === username);
};


// Register
authenticatedUser.post("/register", (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {

    return res.status(404).json({
      message: "Unable to register user."
    });

  }

  if (isValid(username)) {

    return res.status(404).json({
      message: "User already exists."
    });

  }

  users.push({
    username,
    password
  });

  return res.status(200).json({
    message: "User successfully registered. Now you can login"
  });

});


// Login
authenticatedUser.post("/login", (req, res) => {

  const { username, password } = req.body;

  const validUser = users.find(
    user => user.username === username && user.password === password
  );

  if (!validUser) {

    return res.status(404).json({
      message: "Invalid Login. Check username and password"
    });

  }

  let accessToken = jwt.sign(
    {
      data: password
    },
    'access',
    {
      expiresIn: 60 * 60
    }
  );

  req.session.authorization = {
    accessToken,
    username
  };

  return res.status(200).json({
    message: "Customer successfully logged in",
    token: accessToken
  });

});


// Add or modify review
authenticatedUser.put("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;

  const review = req.body.review;

  const username = req.session.authorization
    ? req.session.authorization.username
    : "anonymous";

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/modified successfully",
    reviews: books[isbn].reviews
  });

});


// Delete review
authenticatedUser.delete("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;

  const username = req.session.authorization
    ? req.session.authorization.username
    : "anonymous";

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully"
  });

});

module.exports.authenticated = authenticatedUser;