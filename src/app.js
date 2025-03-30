import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express ()
app.use(cors({
    origin:process.env.CORS_ORIGIN,  //This means that only requests from the specified origin(s) will be allowed to access the application's resources.
    credentials:true // allows the application to include credentials (such as cookies, authorization headers, etc.) in the CORS response.
}))
//configurations
// app.use(express.json({
//     limit:"16kb"
// }))

app.use(express.urlencoded({     // parse URL-encoded bodies (e.g., application/x-www-form-urlencoded)  
    extended:true, // allows for nested objects and arrays in the URL-encoded data
    limit:"16kb"
}))

app.use(express.static("public"))
app.use(cookieParser()) //Allows Express to read cookies from incoming requests. Without this, your server can't access cookies sent by the client.

//routes
import { router as userRouter } from "./routes/user.routes.js";
//routes declaration
// app.use("/user",userRouter) //when user types /user in the url, they will be directes to the userRouter file which contains the user routes
//eg http://localhost:8000/user/register 
//user will be directed to the registerUser function in the user.controller.js file 
//register (it is in user.routes.js) will be directed to the registerUser function in the user.controller.js file
//in industrial practise use:
app.use("/api/v1/users", userRouter);
//eg http://localhost:8000/api/v1/user/register
export {app}