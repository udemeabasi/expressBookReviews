const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
const token = req.headers['authorization'];

if (!token) {
    return res.status(403).send("Access denied. No token provided.");
}

// Verify token (this is a placeholder, replace with actual verification logic)
if (token === "great") {
    next(); // Token is valid, proceed to the next middleware
} else {
    res.status(401).send("Invalid token.");
}
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
