const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if user already exists
  if (!isValid(username)) {
    return res.status(409).json({ message: "Username already exists." });
  }

  // Register the user
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully!" });
});
// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
      return res.status(200).json(book);
  } else {
      return res.status(404).json({ message: "Book not found" });
  }
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let results = [];

  for (let key in books) {
      if (books[key].author === author) {
          results.push(books[key]);
      }
  }

  if (results.length > 0) {
      return res.status(200).json(results);
  } else {
      return res.status(404).json({ message: "No books found for this author" });
  }
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let results = [];

  for (let key in books) {
      if (books[key].title === title) {
          results.push(books[key]);
      }
  }

  if (results.length > 0) {
      return res.status(200).json(results);
  } else {
      return res.status(404).json({ message: "No books found with this title" });
  }
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
      return res.status(200).json(book.reviews);
  } else {
      return res.status(404).json({ message: "Book not found" });
  }
});


module.exports.general = public_users;
