const { sendError } = require("../helpers/errorHelper");
const jwt = require('jsonwebtoken');
const Users = require("../models/Auth");
require("../models/Permission"); // register Permission schema for populate
const protected = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {

      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return sendError(res, "token not found", 400);
    }
    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );
    const userId = decoded._id || decoded.id;
    if (!userId) {
      return sendError(res, "Invalid token payload", 401);
    }
    req.user = await Users.findById(userId)
      .select("-password")
      .populate({
        path: "role",
        populate: {
          path: "permissions"
        }
      });
    if (!req.user) {
      return sendError(res, "user not found", 400);
    }
    if (!req.user.isActive) {
      return sendError(res, "User account is deactivated", 401);
    }
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return sendError(res, "Invalid or expired token", 401);
    }
    console.error("Auth middleware error:", error.name, error.message);
    return sendError(res, error.message, 500);
  }
};

module.exports = { protected };