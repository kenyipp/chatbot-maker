const HTTP_STATUS_CODE = {
    BAD_REQUEST           : 400,
    UNAUTHORIZED          : 401,
    FORBIDDEN             : 403,
    NOT_FOUND             : 404,
    GONE                  : 410,
    INTERNAL_SERVER_ERROR : 500,
    NOT_IMPLEMENT         : 501,
    SERVICE_UNAVAILIABLE  : 503
};

function ErrorInterface ( name, message, code ){
    this.name = name;
    this.message = message;
    this.status = code;
    this.stack = (new Error()).stack;
};

function NotImplement(){
    const name    = "Not Implemented",
          message = "This api has yet to implement",
          code    = HTTP_STATUS_CODE.NOT_IMPLEMENT;
    ErrorInterface.call( this, name , message, code );       
};

function ServiceUnavailable(){
    const name    = "Service Unavailable",
          message = "Server is currently unable to provide service",
          code    = SERVICE_UNAVAILIABLE;
    ErrorInterface.call( this, name , message, code );              
}

// User related 
function Unauthorized (){
    const name    = "Unauthorized",
          message = "Missing or Invalid authentication token ",
          code    = HTTP_STATUS_CODE.UNAUTHORIZED;
    ErrorInterface.call( this, name , message, code );
};

function Forbidden (){
    const name      = "Forbidden",
          message   = "You are not permitted to perform this action",
          code      = HTTP_STATUS_CODE.FORBIDDEN;
    ErrorInterface.call( this, name , message, code );       
};

function NotFound( message = "API Not found" ){
    const name      = "Not Found",
          code      = HTTP_STATUS_CODE.NOT_FOUND
    ErrorInterface.call( this, name , message, code );     
};

function InvalidInput( message, code = HTTP_STATUS_CODE.BAD_REQUEST ){
    const name      = "Invalid Input"
    ErrorInterface.call( this, name , message, code );   
};

function Gone ( message ){
    const name      = "Gone",
          code      = HTTP_STATUS_CODE.GONE
    ErrorInterface.call( this, name , message, code );   
};

function InternalServerError ( message = "Unexpected Server Error" ){
    const name      = "Internal Server Error",
          code      = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    ErrorInterface.call( this, name , message, code );   
};

module.exports = { NotImplement, ServiceUnavailable, Forbidden, Unauthorized, NotFound, InvalidInput, Gone, InternalServerError };

