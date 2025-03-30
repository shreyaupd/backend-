import asyncHandeller from "../utils/asyncHandeller.js";
import { ApiError } from "../utils/ApiError.js";
import {uploadonCloudinary} from "../utils/fileupload.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {User} from "../models/user.model.js";
const registerUser = asyncHandeller(async (req, res) => {

    //1.get user details from frontend
    //2.validate if empty or not
    //3.check if user already exists via email and username
    //4.check avatar and image
    //5.upload them in cloudinary
    //6.create user object and enter in database
    //7.remove password and refresh token from response
    //8.check for user validation
    //9.return res (response) to frontend

    //1. get user details from frontend. This is essentially the logic flow for user registration, ensuring that the system doesn’t allow empty fields or duplicate users to be registered.
    const { fullname, email, username, password } = req.body;
    console.log("email", email);
    if (
        [fullname, email, username, password].some((field) => {
            return field?.trim() === "";
        })
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const exsistingUser = await User.findOne({
        $or: [
            { username } ,{ email }
           
        ]
    })
    if (exsistingUser) {
        throw new ApiError(409, "User already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path 
    //req.files?: Checks if files were uploaded (to prevent errors if no files are uploaded).
    // avatar[0]: Looks at the first file in the avatar array (as there could be multiple files uploaded).
    //path: Returns the location where the file is stored on the server.

    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath)
    {
       throw new ApiError(400, "Avatar is required")
    }

    const avatar= await uploadonCloudinary(avatarLocalPath)
    const coverImage = await uploadonCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar is Required!!!")
    }

    const user = await User.create({
       username: username.toLowerCase(),
       email,
       fullname,
       avatar:avatar.url,
       coverImage:coverImage?.url || "",
       password
    })
     const createdUser = await User.findById(user._id).select("-password -refreshToken")
    //select("-password -refreshToken") is used to exclude the password and refreshToken fields from the returned user object. This is done for security reasons, as you don't want to expose sensitive information to the client.
    if(!createdUser){
        throw new ApiError(500,"User Registration error")
    }

    return res.status(201).json(
        new ApiResponse(201,createdUser,"User created successfully")
     )
})
export  {registerUser};



