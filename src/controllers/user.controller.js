//Routes are the endpoints that define how the server will respond to client requests. They are the URLs that clients use to interact with the server. Routes are defined in the Express application and are used to perform different actions based on the client's request.Controllers in express are used to handle the incoming requests and responses. They are the middlemen between the routes and the database. They contain the logic of the application.


import {asyncHandeller} from "../utils/asyncHandeller.js" 

//method

const registerUser = asyncHandeller(async(req ,res)=>{
 //https status code 200 is success code that means it is ok (status code 100 is informational, 200 is success, 300 is redirection, 400 is client error, 500 is server error)

    res.status(200).json({ 
        message:"ok"
    }) ////the JSON response that is sent when resisterUser is executed. eg Sends { "message": "ok" } with status 201 (Created).
})

// note:
// Uses asyncHandeller to catch errors automatically.
// Handles an HTTP request.
// Responds with a 200 OK status and { message: "ok" } as JSON.
export default registerUser;
