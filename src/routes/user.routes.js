import { Router } from "express";
import registerUser from "../controllers/user.controller.js";
const router = Router();  
//.route() is a method that allows you to define multiple HTTP methods on a single route.
//.post() is a http method that allows you to define a route handler for POST requests to the specified route.
router.route("/register").post(registerUser); //when user types /register in the url, they will be directed to the registerUser function in the user.controller.js file
export default router; 