import mongoose, { Schema } from "mongoose";
const userSchema=new Schema({   //new keyword is used to create a new empty object of a class so that the previous object is not modified. 
   username:{
    type:String,
    required:true,
    unique:true,
    trim:true, //trim is used to remove the white spaces from the string.
    index:true,//searching will be faster if we use index on the field.
   },

   email:{
    type:String,
    required:true,
    unique:true,
    trim:true, //trim is used to remove the white spaces from the string.
   },
   
   fullname:{
    type:String,
    required:true,
    trim:true, //trim is used to remove the white spaces from the string.
    index:true,//searching will be faster if we use index on the field.
   },

   avatar:{
    type:String, //cloudinary url of the image.
    required:true,
   },

   watchHystory:{
    type:Schema.Types.ObjectId, //this will be the id of the movie.
    ref:"video", 
  },

  password:{
    type:String,
    required:true,
  },

  refereshToken:{
    type:String,
  },
},
  {
    timestamps:true, //this will automatically add the created at and updated at fields.
  
})
export default mongoose.model("User",userSchema); //exporting the model.
