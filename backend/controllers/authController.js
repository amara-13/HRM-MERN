const jwt = require("jsonwebtoken")
const Users = require("../models/Auth");
const Role = require("../models/Role");
const sendError = require("../helpers/errorHelper");
const { sendOtpMail } = require("../mails/otpMail");
const bcrypt = require("bcrypt");
const { generateToken, generateResetPasswordToken } = require("../helpers/token");
const OTP = require("../models/OTP");
const crypto = require("crypto");

const {
  isValidEmail,
  isValidPassword,

} = require("../helpers/validationHelper");



const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const cleanEmail = email.toLowerCase().trim();
    const existing = await Users.findOne({ email: cleanEmail });
    if (existing) {
      console.log("User already exists:", email);
      return sendError(res, "user already Registered", 409);
    }


    // const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);
    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword);
    const employeeRole = await Role.findOne({
      name: process.env.BYDEFAULT_USER_ROLE
    });
    if (!employeeRole) {
      return sendError(res, "Employee role not found. Please run the role seed first", 500);
    }

    const user = await Users.create({
      name, email: cleanEmail,
      password: hashPassword,
      phone,
      role: employeeRole._id,
    });

    await OTP.create({
      email: cleanEmail,
      otpHash,
      attempts: 0,
      expiresAt: otpExpire
    });

    const sendMail = await sendOtpMail(cleanEmail, otp, name, otpExpire);
    if (!sendMail) {
      return sendError(res, "Failed to send mail", 500);
    }

    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({
      success: true,
      message: "user register successfully",
      data: userData,
    });
  } catch (error) {
    console.log("Error in register:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

const verifyOtp = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail) {
      return sendError(res, "email is required");
    }
    if (!otpCode) {
      return sendError(res, " otp  is required");
    }
    const existing = await Users.findOne({ email: cleanEmail });
    if (!existing) {
      return sendError(res, "User is not Registered");
    }
    if (existing.otpVerification === true) {
      return sendError(res, "Email is already Verify", 409);
    }
    // if (existing.otpExpire < Date.now()) {
    //   return sendError(res, "otp Expired", 400);
    // }
    const otpRecord = await OTP.findOne({
      email: cleanEmail
    });
    if (!otpRecord) {
      return sendError(res, "OTP is Invalid or expired", 400);
    }
    if (otpRecord.attempts >= 5) {
      return sendError(res, "Too many incorrect OTP attempts. Please request a new OTP.", 429);
    }
    const isValidOtp = await bcrypt.compare(otpCode, otpRecord.otpHash);
    if (!isValidOtp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return sendError(res, "Invalid OTP", 400);
    }


    existing.otpVerification = true;
    // existing.otp = null;
    // existing.otpExpire = null;
    await existing.save();
    await OTP.deleteOne({
      _id: otpRecord._id
    });
    const user = existing.toObject();
    delete user.password;
    return res.status(200).json({
      success: true,
      message: "otp Verify Successfully",
      data: user
    });
  }
  catch (error) {
    return sendError(res, error.message, 500);
  }
}

const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    console.log("remember Me: ", rememberMe);
    const expiresIn = rememberMe ? process.env.JWT_REMEMBERME_EXPIRES_IN : process.env.JWT_NORMAL_EXPIRES_IN;
    if (!email) {
      return sendError(res, "email is required");
    }
    if (!password) {
      return sendError(res, "password is required");
    }
    const cleanemail = email.toLowerCase().trim();

    if (!isValidEmail(cleanemail)) {
      return sendError(res, "Enter valid email");
    }

    if (!isValidPassword(password)) {
      return sendError(res, "Invalid password");
    }


    const user = await Users.findOne({ email: cleanemail });


    if (!user) {
      return sendError(res, "Invalid email or password", 401);
    }

    if (user.otpVerification !== true) {
      return sendError(res, "Email is not verified")
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);


    if (!isCorrectPassword) {
      return sendError(res, "Password mismatch", 401);
    }

    const token = generateToken(user._id, expiresIn);
    return res.status(200).json({
      success: true,
      message: "user Login Successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });


  } catch (error) {
    return sendError(res, error.message, 500);
  }
}
const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const cleanEmail = email.toLowerCase().trim()
    const user = await Users.findOne({ email: cleanEmail });
    if (!user) {
      return sendError(res, "Invalid email");
    }
    if (user.otpVerification !== true) {
      return sendError(res, "email is not verified");
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);
    const sendMail = await sendOtpMail(cleanEmail, otp, user.name, otpExpire);
    if (!sendMail) {
      return sendError(res, "Failed to send Mail", 500);
    };
    user.otp = otp;
    user.otpExpire = otpExpire;

    await user.save();
    return res.status(200).json({
      success: true,
      message: "send Otp successfully",

    });
  } catch (error) {
    return sendError(res, error.message, 500)
  }
}

const sendForgetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendError(res, "Email is required");
    }

    const cleanEmail = email.toLowerCase().trim();

    if (!isValidEmail(cleanEmail)) {
      return sendError(res, "Invalid email");
    }

    const user = await Users.findOne({
      email: cleanEmail
    });

    if (!user) {
      return sendError(
        res,
        "No account found with this email",
        404
      );
    }

    if (user.otpVerification !== true) {
      return sendError(
        res,
        "Please verify your email first",
        409
      );
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpire = new Date(
      Date.now() + 10 * 60 * 1000
    );
    await OTP.deleteMany({
      email: cleanEmail
    });

    await OTP.create({
      email: cleanEmail,
      otpHash,
      attempts: 0,
      expiresAt: otpExpire
    });

    const sendMail = await sendOtpMail(
      cleanEmail,
      otp,
      user.name,
      otpExpire
    );

    if (!sendMail) {
      return sendError(
        res,
        "Failed to send mail",
        500
      );
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {
    return sendError(
      res,
      error.message,
      500
    );
  }
};
const verifyForgetOtp = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    const cleanEmail = email.toLowerCase().trim();
    const existing = await Users.findOne({ email: cleanEmail });
    if (!existing) {
      return sendError(res, "User is not Registered");
    }
    if (existing.otpVerification !== true) {
      return sendError(res, "Email is not  Verified", 409);
    }
    // if (existing.otpExpire < Date.now()) {
    //   return sendError(res, "otp Expired", 400);
    // }
    // if (existing.otp !== otpCode) {
    //   return sendError(res, "Invalid OTP", 400);
    // }

    const otpRecord = await OTP.findOne({ email: cleanEmail });
    if (!otpRecord) {
      return sendError(res, "OTP is Invalid or expired");
    }
    if (otpRecord.attempts >= 5) {
      return sendError(res, "Too many incorrect OTP attempts. Please request a new OTP.", 429);
    }
    const isValidOtp = await bcrypt.compare(otpCode, otpRecord.otpHash);
    if (!isValidOtp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return sendError(res, "Invalid OTP", 400)
    }
    await OTP.deleteOne({
      _id: otpRecord._id
    });

    let resetToken;
    try {
      resetToken = generateResetPasswordToken(existing._id, existing.email);
    } catch (tokenError) {
      return sendError(res, "Failed to generate reset token: " + tokenError.message, 500);
    }

    const user = existing.toObject();
    delete user.password;
    return res.status(200).json({
      success: true,
      message: "otp Verify Successfully",
      data: user,
      token: resetToken,
    });
  }
  catch (error) {
    return sendError(res, error.message, 500);
  }
}
const resetPassword = async (req, res) => {
  try {
    const { token, email, password, confirmPassword } = req.body;
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail) {
      return sendError(res, "email is required");
    }
    if (!password) {
      return sendError(res, "password is required");
    }
    if (!confirmPassword) {
      return sendError(res, "cnfirm password is required");
    }

    if (!isValidEmail(cleanEmail)) {
      return sendError(res, "Invalid email");
    }

    if (!isValidPassword(password)) {
      return sendError(res, "Invalid password");
    }
    if (!isValidPassword(confirmPassword)) {
      return sendError(res, "Invalid confirm password");
    }
    if (password !== confirmPassword) {
      return sendError(res, "Password and Confirm Password Does not match");
    }
    if (!token) {
      return sendError(res, "token is required");
    }
    let verifyToken;
    try {
      verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return sendError(res, "Reset session expired. Please request a new OTP", 401);
      }
      return sendError(res, "Invalid reset token", 401);
    }
    if (verifyToken.purpose !== "reset-password") {
      return sendError(res, "Invalid token type", 403);
    }

    const user = await Users.findById(verifyToken._id);

    if (!user) {
      return sendError(res, "User not found");
    }
    if (user.otpVerification !== true) {
      return sendError(res, "email is not verified");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      // data:userData
    });

  } catch (error) {
    return sendError(res, error.message, 500)
  }
}
module.exports = {
  register,
  verifyOtp,
  login,
  verifyEmail,
  verifyForgetOtp,
  sendForgetOtp,
  resetPassword,

}