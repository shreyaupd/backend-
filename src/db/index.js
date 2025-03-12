import mongoose from "mongoose";
import {DB_Name} from "../constants.js";

const connectDB =async()=>{
    try{
      const connectedOrNot= await mongoose.connect(`${process.env.MONGODB_URL}/${DB_Name}`)
      console.log(`\n MongoDB connect !! DB HOST: ${connectedOrNot.connection.host}`)
    }

    catch (error){
        console.log("MONGODB connection error",error)
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