//Routes are the endpoints that define how the server will respond to client requests. They are the URLs that clients use to interact with the server. Routes are defined in the Express application and are used to perform different actions based on the client's request.Controllers in express are used to handle the incoming requests and responses. They are the middlemen between the routes and the database. They contain the logic of the application.


import asyncHandeller from "../utils/asyncHandeller.js";
import {ApiError} from "../utils/ApiError.js";
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
const { fullname, email, username, password } = req.body;
console.log("email", email);
if(
    [fullname,email,username,password].some((fiels))=>{
        field?.trim()===""
    }
    {
        throw new ApiError(400,"All fields are required")
    }

    const exsistingUser = UserActivation.findOne({
        $or: [
            {email},
            {username}
        ]
    })
    if (exsistingUser){
        throw new ApiError(409,"User already exists")
    } 
}
)
// note:
// Uses asyncHandeller to catch errors automatically.
// Handles an HTTP request.
// Responds with a 200 OK status and { message: "ok" } as JSON.

export default registerUser;

//Routes are the endpoints that define how the server will respond to client requests. They are the URLs that clients use to interact with the server. Routes are defined in the Express application and are used to perform different actions based on the client's request.Controllers in express are used to handle the incoming requests and responses. They are the middlemen between the routes and the database. They contain the logic of the application.
 

