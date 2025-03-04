const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (users.some(user => user.username === username)) {
        return res.status(409).json({ message: "Username already exists" });
    }
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    const thebooks = await getBooks();
    res.status(200).json({ thebooks});
});

async function getBooks() {
    try {
        // Fetch books from the server
        return books; // Return books
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error; // Propagate the error if needed
    }
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const book = await getBookDetails(isbn);  // Fetch book details asynchronously
        if (book) {
            res.status(200).json({ book });
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching book details" });
    }
});

// Asynchronous function to get book details based on ISBN
async function getBookDetails(isbn) {
    try {
        return books[isbn] || null; // If the book exists, return it, otherwise return null
    } catch (error) {
        console.error('Error fetching book details:', error);
        throw error; // Propagate the error if needed
    }
}
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author.toLowerCase();

    try {
        const authorBooks = await getBooksByAuthor(author);

        if (authorBooks.length > 0) {
            res.status(200).json({ books: authorBooks });
        } else {
            res.status(404).json({ message: "This author has no books" });
        }
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: "Error fetching books" });
    }
});

// Function to get books by the given author
async function getBooksByAuthor(author) {
    try {
        const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author);
        return filteredBooks;
    } catch (error) {
        console.error('Error while filtering books by author:', error);
        throw error;
    }
}
// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title.toLowerCase();

    try {
        const titleBooks = await getBooksByTitle(title);

        if (titleBooks.length > 0) {
            res.status(200).json({ books: titleBooks });
        } else {
            res.status(404).json({ message: "No books found with the given title" });
        }
    } catch (error) {
        console.error('Error fetching books by title:', error);
        res.status(500).json({ message: "Error fetching books" });
    }
});

// Function to fetch books based on title
async function getBooksByTitle(title) {
    try {
        const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title);
        return filteredBooks;
    } catch (error) {
        console.error('Error while filtering books by title:', error);
        throw error;
    }
}

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.status(200).json({ reviews: books[isbn].reviews})
    } else {
        res.status(404).json({message: "book not found"});
    }
});

public_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    if (!req.session.authorization) {
        return res.status(403).json({ message: "User not logged in" });
    }
    const username = req.user.username;
    if (!books[isbn] || !books[isbn].reviews) {
        return res.status(404).json({ message: "Book not found or no reviews available" });
    }
    if (!books[isbn].reviews[username]) {
        return res.status(403).json({ message: "You can only delete your own reviews" });
    }
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.general = public_users;
