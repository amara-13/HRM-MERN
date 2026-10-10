const rateLimiter = require("express-rate-limit");
const sendError = require("../helpers/errorHelper");
const loginLimiter = rateLimiter({
    windowMs: Number(process.env.RATELIMIT),
    max: Number(process.env.RATELIMIT_MAX),
    handler:(req,res)=>{
        sendError(res,"Too Many Attempts.please try again Later");
    }

});

const sendOtpLimiter = rateLimiter({
    windowMs: Number(process.env.OTP_RATELIMIT_TIME),
    max: Number(process.env.OTP_RATELIMIT),
    handler:(req,res)=>{
        sendError(res,'Too many OTP requests. please try again later');
    }
});
const verifyOtpLimiter = rateLimiter({
    windowMs: Number(process.env.OTP_VERIFY_RATELIMIT_TIME),
    max: Number(process.env.OTP_VERIFY_RATELIMIT),
    handler:(req,res)=>{
        sendError(res,"Too many OTP verification attempts. Please try again later")
    }
});
module.exports = {loginLimiter,sendOtpLimiter,verifyOtpLimiter};