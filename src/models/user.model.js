import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({   //new keyword is used to create a new empty object of a class so that the previous object is not modified. 
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, //trim is used to remove the white spaces from the string.
    index: true,//searching will be faster if we use index on the field.
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true, //trim is used to remove the white spaces from the string.
  },

  fullname: {
    type: String,
    required: true,
    trim: true, //trim is used to remove the white spaces from the string.
    index: true,//searching will be faster if we use index on the field.
  },

  avatar: {
    type: String, //cloudinary url of the image.
    required: true,
  },

  watchHystory: {
    type: Schema.Types.ObjectId, //this will be the id of the movie.
    ref: "video",
  },

  password: {
    type: String,
    required: true,
  },

  refereshToken: {
    type: String,
  },
},
  {
    timestamps: true, //this will automatically add the created at and updated at fields.

  })

//pre hook le save hununvanda agadi kaam garxa. line  by line kunai ni code ma pre save hunu agadi k garne tyo code lai programmer ko anusar garxa eg:password encryption.
userSchema.pre("save", async function (next) { //arrow function le this keyword lai use garna mildaina so we use normal function.
  if (!this.isModified("password")) //isModified is a method that is used to check if the password field has been modified or not. if 'if' is not used then the password will be hashed every time the document is saved.
    return next(); // if the password field has not been modified then the function will return and the next middleware function in the stack will be called.
  this.password = bcrypt.hash(this.password, 10) //this refers to the document ((instance) instance refers to a specific user document created from the User model that is being saved to the database) that is being saved.
  //this.password: Refers to the password field of the document being saved.
  next(); //Calls the next middleware function in the stack.
})

userSchema.models.isPasswordCorrect = async function(password){
     return await bcrypt.compare(password,this.password) // this.password refers to the encrypted password stored in the database from above function.
   // async await is required because encryption and decryption requires time.
}
export const User= mongoose.model("User", userSchema); //User is a Mongoose model created from the userSchema.
