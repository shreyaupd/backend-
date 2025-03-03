import dotenv from "dotenv"
import connectDB from "./db/index.js";
import express from "express";
dotenv.config({path:"./env"})
const app=express();
const PORT = process.env.PORT

connectDB();
app.listen(process.env.PORT,
    ()=>console.log(`Server is running on http://localhost:${process.env.PORT}`)
)







/*
import express from "express"
const app = express()
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