const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
let secretKey = "the_secret_key";

const isValid = (username)=>{ //returns boolean
return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
 return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (!isValid(username)) {
        return res.status(404).json({ message: "Wrong username" });
    }
    if (!authenticatedUser(username, password)) {
        return res.status(404).json({message: "Wrong password or username"});
    }
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    req.session.authorization = { accessToken: token };
    return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;

    // Check if user is authenticated
    if (!req.session.authorization) {
        return res.status(403).json({ message: "User not logged in" });
    }

    const username = req.user.username; // Get the logged-in user's username

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!review) {
        return res.status(400).json({ message: "Review content required" });
    }

    // Add or update review
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
