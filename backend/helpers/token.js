const jwt = require("jsonwebtoken");
const generateToken = (userId, expiresIn) => {
    return jwt.sign(
        { _id: userId },
        process.env.JWT_SECRET,
        { expiresIn: expiresIn }
    );
}
const generateResetPasswordToken = (userId, email) => {
    return jwt.sign(
        {
            _id: userId,
            email: email,
            purpose: 'reset-password',
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.RESET_PASSWORD_TOKEN_EXPIRES }
    );
}
module.exports = { generateToken, generateResetPasswordToken };