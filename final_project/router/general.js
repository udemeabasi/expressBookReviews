const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username; 
  const password = req.body.password; 
  // Check if username or password is missing 
  if (!username || !password) { 
  return res.status(404).json({ message: "Error logging in" }); 
  } 
  // Authenticate user 
  if (authenticatedUser(username, password)) { 
  // Generate JWT access token 
  let accessToken = jwt.sign({ 
  data: password 
  }, 'access', { expiresIn: 60 * 60 }); 
  // Store access token and username in session 
  req.session.authorization = { 
  accessToken, username 
  } 
  return res.status(200).send("User successfully logged in"); 
  } else { 
  return res.status(208).json({ message: "Invalid Login. Check username and password" }); 
  }
  }); 
  

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json({message: books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
  return res.status(300).json({message: book});
  } else {
    res.status(404).json({message: "book not found"})
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author.toLowerCase();
  const booksByAuthor = [];

  for (const isbn in books) {
    if (books[isbn].author.toLowerCase() === author) {
        booksByAuthor.push(books[isbn])
    }
  }

  if (booksByAuthor.length > 0) {
    res.status(300).json({message: booksByAuthor});
  } else {
    res.status(404).json({ message: "No books found"})
  }
})


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title.toLowerCase();
  const bookDetails = [];

  // Iterate through the books object
  for (const isbn in books) {
      if (books[isbn].title.toLowerCase() === title) {
          bookDetails.push(books[isbn]);
      }
  }

  if (bookDetails.length > 0) {
      res.status(200).json(bookDetails);
  } else {
      res.status(404).json({ message: "No book found with this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book && book.reviews) {
        res.status(200).json(book.reviews);
    } else {
        res.status(404).json({ message: "No reviews found for this book" });
    }
});

module.exports.general = public_users;
