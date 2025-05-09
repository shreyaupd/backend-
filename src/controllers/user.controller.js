import asyncHandeller from "../utils/asyncHandeller.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadonCloudinary } from "../utils/fileupload.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"
//6. if password is correct? create access token and refresh token
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken // users refreshToken is updated with the new refresh token
        await user.save({ validateBeforeSave: false }) //

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}
const registerUser = asyncHandeller(async (req, res) => {

    //1.get user details from frontend in RAM 
    //2.validate if empty or not
    //3.check if user already exists via email or username
    //4.check avatar and coverImage
    //5.upload them in cloudinary
    //6.create user object and enter in database ie. saving
    //7.remove password and refresh token from response
    //8.check for user validation
    //9.return res (response) to frontend

    //1. get user details from frontend. This is essentially the logic flow for user registration, ensuring that the system doesn’t allow empty fields or duplicate users to be registered.
    const { fullname, email, username, password } = req.body;
    //  console.log("email", email);
    //2. validate if empty or not
    if (
        [fullname, email, username, password].some((field) => field?.trim() === "") //
    ) {
        throw new ApiError(400, "All fields are required")
    }
    //3. check if user already exists via email or username
    const exsistingUser = await User.findOne({
        $or: [
            { username }, { email }

        ]
    })
    if (exsistingUser) {
        throw new ApiError(409, "User already exists")
    }
    //4. check avatar and image
    const avatarLocalPath = req.files?.avatar[0]?.path
    //req.files?: Checks if files were uploaded (to prevent errors if no files are uploaded).
    // avatar[0]: Looks at the first file in the avatar array (as there could be multiple files uploaded).
    //path: Returns the location where the file is stored on the server.

    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        // If coverImage is an array and has at least one file, get the path of the first file.
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }
    //5. upload them in cloudinary
    const avatar = await uploadonCloudinary(avatarLocalPath)
    const coverImage = await uploadonCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar is Required!!!")
    }
    //6. create user object and enter in database 
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password
    })

    //7. remove password and refresh token from response
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    //select("-password -refreshToken") is used to exclude the password and refreshToken fields from the returned user object. This is done for security reasons, as you don't want to expose sensitive information to the client.
    //8. check for user validation
    if (!createdUser) {
        throw new ApiError(500, "User Registration error")
    }
    //9. return res (response) to frontend
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User created successfully")
    )
})

const loginUser = asyncHandeller(async (req, res) => {
    //1.bring data from req body
    //2.username or emil
    //3.user exist or not
    //4.if user? check password
    //5.no password? throw error
    //6.if password is correct? create access token and refresh token
    //7.send to cookies
    //8.response to frontend

    //1. bring data from req body
    const { email, username, password } = req.body
    //2. username or email
    if (!username && !email) {
        throw new ApiError(400, "Username or email is required!!")
    }

    const user = await User.findOne({
        $or: [
            { username },
            { email }
        ]
    })
    //3. user exist or not
    if (!user) {
        throw new ApiError(404, "User doesn't exist!!")
    }
    //4. if user? check password
    if (!password) {
        throw new ApiError(400, "Password is required!!")
    }
    //5. no password? throw error
    const correctpassword = await user.isPasswordCorrect(password)//calling the method from user model to check password isPasswordCorrect is a method defined in the user model that checks if the password provided by the user matches the hashed password stored in the database.
    if (!correctpassword) {
        throw new ApiError(401, "Invalid password!!")
    }
    //6. if password is correct? create access token and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    //7. send to cookies
    const loggedUser = await User.findById(user._id).select("-password -refreshToken")
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(200, {
        user: loggedUser,
        accessToken,
        refreshToken,
    }, "User logged in successfully"))


})

const logoutUser = asyncHandeller(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(
        new ApiResponse(200, {}, "User logged out successfully")


    )

})

const refreshAccessToken = asyncHandeller(async (req, res) => {
    const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incommingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }
    //to check if the refresh token is valid or not, we can use the jwt.verify method from the jsonwebtoken library. This method takes the refresh token and the secret key used to sign it as arguments and returns the decoded token if it's valid.
    try {
        const decodedtoken = jwt.verify(
            incommingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        //why find user? because we want to check if the user is valid or not
        //if the user is not found, we can throw an error indicating that the user is not authorized.
        const user = await User.findById(decodedtoken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
        if (incommingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Invalid refresh token")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newrefreshToken } = await generateAccessAndRefereshTokens(user._id)

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newrefreshToken, options)
            .json(new ApiResponse(200, { accessToken, newrefreshToken }, "Access token refreshed successfully")
            )
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized access! Invalid token.")

    }
})

const changePassword = asyncHandeller(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid password")
    }
    user.password = newPassword
    await user.save({ validateBeforeSave: false })
    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"))

})

const getuser = asyncHandeller(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully"))
})

const updateAccountDetails = asyncHandeller(async (req, res) => {
    const { fullname, email } = req.body
    if (!fullname || !email) {
        throw new ApiError(400, "Fullname and email are required")
    }
    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { //set is used to update the fields in the database
                fullname,
                email //email:email 
            }
        },
        { new: true }

    ).select("-password")
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User details updated successfully"))

})

const updateAvatar = asyncHandeller(async (req, res) => {
    avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }
    const avatar = await uploadonCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "Avatar is required")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar: avatar.url
            }

        },
        {
            new: true
        }

    ).select("-password")

    return res.status(200).json(new ApiResponse(200, user, "User avatar updated successfully"))
})


const updateCover = asyncHandeller(async (req, res) => {
    coverImageLocalPath = req.file?.path
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover Image is required")
    }
    const coverImage = await uploadonCloudinary(coverImageLocalPathh)

    if (!coverImage.url) {
        throw new ApiError(400, "Avatar is required")
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                coverImage: coverImage.url
            }

        },
        {
            new: true
        }

    ).select("-password")

    return res.status(200).json(new ApiResponse(200, user, "User cover image updated successfully"))
})

//subscriber → follower and channel → the person being followed
const getUserChannelProfile = asyncHandeller(async (req, res) => {
    const { username } = req.params //params are the values that are passed in the URL of the request. For example, if the URL is /user/johndoe, then the username parameter would be johndoe.
    if (!username?.trim()) {
        throw new ApiError(400, "Username is required")
    }
    const channel = await User.aggregate([
        {
            $match: { username: username?.toLowerCase() }
        },
        {
            $lookup: { // “Who are the people that have subscribed to this user’s channel?” hunxa.
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel", 
                as: "subscribers"
            }
        },

        {
            $lookup: { //“Who has this user followed?”
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: { $size: "$subscribers" },
                subscribedToCount: { $size: "$subscribedTo" },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }



            }
        },
        {
            $project: { //project is used to include or exclude fields from the result set. In this case, we are including the fullname, username, avatar, coverImage, subscribersCount, subscribedToCount, and isSubscribed fields in the result set.
                fullname: 1,
                username: 1,
                subscribersCount: 1,
                subscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1,
                createdAt: 1,
            }
        }
     

    ]);

    if (!channel?.length) {
        throw new ApiError(404, "Channel not found")
    }

    return res.status(200).json(new ApiResponse(200, channel[0], "User channel profile fetched successfully"))
})
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    getuser,
    updateAccountDetails,
    updateAvatar,
    updateCover,
    getUserChannelProfile
};

