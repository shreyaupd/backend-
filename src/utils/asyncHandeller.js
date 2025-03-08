const asyncHandeller=(requestHandeller)=>{ //asyncHandeller is a function that returns a function ie.Higher order function . If requestHandeller throws an error, we catch it and pass it to next(err), so Express knows something went wrong.
    (req,res,next)=>{    //This is the function that actually handles a request in Express.
        Promise.resolve(requestHandeller(req,res,next)) //This makes sure that even if requestHandeller isn't explicitly async, it still returns a promise. This way, errors inside requestHandeller can be caught by .catch().
        .catch((err)=>next(err)) //If requestHandeller throws an error, we catch it and pass it to next(err), so Express knows something went wrong.
    }
    
}

export default asyncHandeller

// const asyncHandeler = (fn) => async (req, res, next) => {
//  try {
//   await fn(req, res, next);
//  } catch (error) {
//     res.status(error.code || 500).json({
//         success: false,
//         message: error.message 
//      });
//  }
// }
 