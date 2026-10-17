const {
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isValidName
} = require("../helpers/validationHelper");
const { sendError } = require("../helpers/errorHelper");

const registerValidation = (req, res, next) => {
  const { name, email, password, phone } = req.body;
  if (!name) {
    return sendError(res, "name is required");
  }
  if (!isValidName(name)) {
    return sendError(res, "Invalid name");
  }
  if (!email) {
    return sendError(res, "email is required");
  }
  if (!isValidEmail(email)) {
    return sendError(res, "Invalid email");
  }
  if (!password) {
    return sendError(res, "password is required");
  }
  if (!isValidPassword(password)) {
    return sendError(res, "Invalid password");
  }
  if (!phone) {
    return sendError(res, "phone is required");
  }
  if (!isValidPhone(phone)) {
    return sendError(res, "Invalid Phone");
  }
  next();

}
module.exports = registerValidation;

