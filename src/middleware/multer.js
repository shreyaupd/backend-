import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ 
    storage, 
})


  //This snippet configures Multer to handle file uploads by specifying where to store the uploaded files and how to name them.
// Multer is imported to handle file uploads.
// The storage configuration is defined:
// Files will be saved in .public/temp.
// Files will keep their original names (e.g., photo.jpg).
// The upload middleware is created, which will handle the actual process of uploading files when you use it in your routes.