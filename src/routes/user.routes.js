import { Router } from "express";
import { upload } from "../middleware/multer.js";
import registerUser from "../controllers/user.controller.js";
const router = Router();  
//.route() is a method that allows you to define multiple HTTP methods on a single route.
//.post() is a http method that allows you to define a route handler for POST requests to the specified route.
//upload.fields() is a method from the multer middleware called upload that allows you to specify multiple fields for file uploads.
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser); 
export default router; 