import asyncHandeller from "../utils/asyncHandeller.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandeller(async (req, _, next) => {
    // Extract token from cookies or Authorization header
    try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", ""); //request header means the way the client sends data to the server. Where header means the metadata of the request.  which contains information about the request, such as the type of content being sent, the length of the content, and any authentication tokens that may be required to access the requested resource.
    // operator ? is used to check if the accessToken cookie exists. If it does, it assigns its value to the token variable. If it doesn't, it assigns undefined to the token variable. 
    //  req.header("Authorization")?.replace("Bearer ", "") vaneko Authorization xa ki nai paile check gareko ho ani paxi authentication header ma Bearer token xa ki xaina bhanera check garne ho.
    //  If it exists, it removes the "Bearer " prefix from the token string and assigns the remaining part to the token variable.


    if (!token) {
        
        throw new ApiError(401, "Unauthorized access! Token is missing.");
    }
    
        // Verify the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // jwt is a library that encodes and decodes the token.verify method actually decodes the token and checks if it is valid or not.
        //the decodedtoken variable varifies the accesstoken by taking two arguments the token and the secret key used to sign the token. If the token is valid, it returns the decoded token. If not, it throws an error. 
        // Find the user in the database so that we can check if the user exists and is not deleted or inactive.
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Unauthorized access! User not found.");
        }

        // Attach user to the request object
        req.user = user;
        // Scope of user (the variable) is limited to the function where it’s declared.
        // Scope of req.user (the property on the req object) is global to the request and can be accessed across all middleware and route handlers for that request.

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            // Return specific error to trigger refresh
            throw new ApiError(401, "Token expired", {
                code: "TOKEN_EXPIRED",
                solution: "Please refresh your token using /refresh-token endpoint"
            });
        }
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});

