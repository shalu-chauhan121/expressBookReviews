const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
module.exports.users = users;


// ✅ Util: Check if username is available (used during registration)
const isValid = (username) => {
  return !users.some(user => user.username === username);
};

// ✅ Util: Check if credentials are valid
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// ✅ Task 7: Login and create JWT session
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const token = jwt.sign({ username }, 'access', { expiresIn: '1h' });

  req.session.authorization = {
    token,
    username
  };

  return res.status(200).json({ message: "User logged in successfully!", token });
});

// ✅ Task 8: Add or modify a review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Initialize reviews if not present
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully.", reviews: books[isbn].reviews });
});

// ✅ Task 9: Delete a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (books[isbn].reviews && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully." });
  } else {
    return res.status(404).json({ message: "Review not found for this user." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
