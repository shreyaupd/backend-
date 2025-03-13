class ApiError extends Error {
 constructor(
    statusCode,
    message="Something went wrong",
    error=[],
    statck=""
    ){
        super(message)
        this.statusCode=statusCode
        this.data=null
        this.message=message
        this.statck=statck
        this.errors=error
        if (stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}