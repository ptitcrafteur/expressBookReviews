const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.status(200).json({ books: JSON.stringify(books, null, 2) });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.status(200).json({ books: books[isbn]})
    } else {
        res.status(404).json({message: "book not found"});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author.toLowerCase();
    let authorBooks = [];

    for (let id in books) {
        if (books[id].author.toLowerCase() === author) {
            authorBooks.push({ id, ...books[id] });
        }
    }

    if (authorBooks.length > 0) {
        res.status(200).json({ books: authorBooks });
    } else {
        res.status(404).json({ message: "This author has no books" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
