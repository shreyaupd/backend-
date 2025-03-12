import dotenv from "dotenv"
import connectDB from "./db/index.js";
import express from "express";
dotenv.config({path:"./env"}) //Loads the environment variables from the .env file into process.env.
const app=express();
const PORT = process.env.PORT

connectDB() //Tries to connect to MongoDB using Mongoose.
.then(()=>{  //Inside this block, we start the Express server only if the connectDB() is true.
    app.listen(process.env.PORT,
    ()=>console.log(`Server is running on http://localhost:${process.env.PORT}`) // eg: Server is running on http://localhost:5000

)})
.catch((err)=>{
    console.log("There was an error connecting MongoDB",err)
})









/*
import express from "express"
const. app = express()
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("errror", (error) => {
            console.log("ERRR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("ERROR: ", error)
        throw err
    }
})()

*/