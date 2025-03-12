import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express ()
app.use(cors({
    origin:process.env.CORS_ORIGIN,  //This means that only requests from the specified origin(s) will be allowed to access the application's resources.
    credentials:true // allows the application to include credentials (such as cookies, authorization headers, etc.) in the CORS response.
}))
//configurations
app.use(express.json({
    limit:"16kb"
}))

app.use(express.urlencoded({     // parse URL-encoded bodies (e.g., application/x-www-form-urlencoded)  
    extended:true, // allows for nested objects and arrays in the URL-encoded data
    limit:"16kb"
}))

app.use(express.static("public"))
app.use(cookieParser()) //Allows Express to read cookies from incoming requests. Without this, your server can't access cookies sent by the client.

export default app