import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URL, {
            dbName: DB_NAME
        });
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export default connectDB


//Summary of the code: 
// ✅ Imports Mongoose & DB name.
// ✅ Defines an async function to connect to MongoDB.
// ✅ Uses try...catch to handle success & errors.
// ✅ Uses mongoose.connect() to establish a connection.
// ✅ Exports the function so it can be used elsewhere.