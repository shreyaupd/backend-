//Routes are the endpoints that define how the server will respond to client requests. They are the URLs that clients use to interact with the server. Routes are defined in the Express application and are used to perform different actions based on the client's request.Controllers in express are used to handle the incoming requests and responses. They are the middlemen between the routes and the database. They contain the logic of the application.


import asyncHandeller from "../utils/asyncHandeller.js";

const registerUser = asyncHandeller(async (req, res) => {

//1.get user details from frontend
//2.validate if empty or not
//3.check if user already exists via email and username
//4.check avatar and image
//5.upload cloudinary
//6.create user object 
//7.remove password and refresh token from response
//8.check for user validation
//9.return res (response) to frontend

//1. get user details from frontend
const { username, email, fullname, password } = req.body;
console.log("email", email);
res.status(200).json({ message: "User registered successfully" });
})
// note:
// Uses asyncHandeller to catch errors automatically.
// Handles an HTTP request.
// Responds with a 200 OK status and { message: "ok" } as JSON.

export default registerUser;

//Routes are the endpoints that define how the server will respond to client requests. They are the URLs that clients use to interact with the server. Routes are defined in the Express application and are used to perform different actions based on the client's request.Controllers in express are used to handle the incoming requests and responses. They are the middlemen between the routes and the database. They contain the logic of the application.
 

