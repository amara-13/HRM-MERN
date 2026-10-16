const sendError = (res,message,statusCode=400)=>{
    return res.status(statusCode).json({
 success:false,
 message
    });
};
const sendResponse = (res,message,statusCode = 200,data)=>{
    return res.status(statusCode).json({
        success:true,
        message,
        data:data,
    });
}
module.exports = {sendError,sendResponse};