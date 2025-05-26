import { Router } from "express";
import { upload } from "../middleware/multer.js";
import { loginUser, logoutUser,refreshAccessToken } from "../controllers/user.controller.js";
import { registerUser } from "../controllers/user.controller.js"; 
import { verifyJWT } from "../middleware/auth.middleware.js";
import { changePassword } from "../controllers/user.controller.js";
import { getuser } from "../controllers/user.controller.js";
import { updateAccountDetails } from "../controllers/user.controller.js";
import {updateAvatar} from "../controllers/user.controller.js";
import { updateCover } from "../controllers/user.controller.js";
import { getUserChannelProfile } from "../controllers/user.controller.js";
import { getWatchHistory } from "../controllers/user.controller.js";

const router = Router();
//.route() is a method that allows you to define multiple HTTP methods on a single route.
//.post() is a http method that allows you to define a route handler for POST requests to the specified route.
//upload.fields() is a method from the multer middleware called upload that allows you to specify multiple fields for file uploads.
// Define the route for user registration
router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
);

router.route("/login").post(
    loginUser
);

router.route("/logout").post(
    verifyJWT,logoutUser
);
router.route("/refresh-token").post(
    refreshAccessToken
);
router.route("/change-password").post(
    verifyJWT,
    changePassword
);
router.route("/change-user").post(
    verifyJWT,
    getuser
);


router.route("/update-account").patch(
    verifyJWT,
    updateAccountDetails
);

router.route("/avatar").patch(
    verifyJWT,
    upload.single("avatar"),
    updateAvatar
)
router.route("/cover-image").patch(
    verifyJWT,
    upload.single("/coverImage"),
    updateCover 
);
router.route("/c/:username").get(
    verifyJWT,
   getUserChannelProfile
);

router.route("/history").get(
    verifyJWT,getWatchHistory
)
export { router };