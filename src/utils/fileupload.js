import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'; //file system helps to read write remove async sync files. It is a core module of nodejs
     // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET,
    }); 

    const uploadonCloudinary = async (file) => {
        try{
              if(!file) return null;
              //upload file on cloudanary
              const response= await cloudinary.uploader.upload(file,{
                resource_type:"auto",//to detect the file type
              })
              //file has been upladed successfully
              //console.log("File is uploaded successfully",response.url);//This prints a message to the console with the file's URL.response.url is the URL of the uploaded file.
               fs.unlinkSync(file);
              return response //Return uploaded file details
        }
        catch(error){
              fs.unlinkSync(file); // Delete the temp file if upload fails
                return null; //Return null to indicate failure
        }
    }
    export {uploadonCloudinary}


//  Takes a file as input.
// Uploads it to Cloudinary.
// Logs the URL if successful.
// Deletes temp file if upload fails.
// Returns the uploaded file details or null.



//NOTE
// When a user uploads a file through a website (using a form), the file isn’t stored on your server. Instead, it’s sent in a special format called multipart/form-data.

// Cloudinary cannot directly handle this format—it needs an actual file path.

//  How Multer Helps:
// It is a middleware for handling multipart/form-data.Multi-part form data is a format that allows you to send files through a form. Multer helps you extract the uploaded file from the request and save it to your server.
// Extracts the uploaded file from the request.
// Saves it temporarily to your server.
// Gives you a file path that you can pass to Cloudinary