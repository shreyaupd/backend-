import asyncHandeller from "../utils/asyncHandeller.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandeller(async (req, res, next) => {
    // Extract token from cookies or Authorization header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    console.log("Extracted Token:", token); // Debug log

    if (!token) {
        throw new ApiError(401, "Unauthorized access! Token is missing.");
    }

    try {
        // Verify the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Find the user in the database
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Unauthorized access! User not found.");
        }

        // Attach user to the request object
        req.user = user;
        next();
    } catch (error) {
        // Handle token verification errors
        throw new ApiError(401, error?.message || "Unauthorized access! Invalid token.");
    }
});