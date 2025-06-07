const express = require('express');
const axios = require('axios');
const public_users = express.Router();

// Replace this URL with your actual API endpoint or local server URL where books data is accessible
const BOOKS_API_URL = "http://localhost:3000/books"; 

// Task 10: Get the book list available in the shop using async-await + axios
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get(BOOKS_API_URL);
    // Assuming response.data contains the books JSON object
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch books", error: error.message });
  }
});

// Task 11: Get book details based on ISBN using async-await + axios
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`${BOOKS_API_URL}/${isbn}`);
    if (response.data) {
      return res.status(200).json(response.data);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    // If API returns 404 or other errors
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(500).json({ message: "Error fetching book details", error: error.message });
  }
});

// Task 12: Get book details based on author using async-await + axios
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    // Assume there's an API endpoint like /books?author=authorName
    const response = await axios.get(`${BOOKS_API_URL}?author=${encodeURIComponent(author)}`);

    if (response.data && response.data.length > 0) {
      return res.status(200).json(response.data);
    } else {
      return res.status(404).json({ message: "No books found for this author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

// Task 13: Get book details based on title using async-await + axios
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    // Assume there's an API endpoint like /books?title=bookTitle
    const response = await axios.get(`${BOOKS_API_URL}?title=${encodeURIComponent(title)}`);

    if (response.data && response.data.length > 0) {
      return res.status(200).json(response.data);
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
});

module.exports.general = public_users;
