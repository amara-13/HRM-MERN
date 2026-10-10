const mongoose = require('mongoose');
const { timeStamp } = require('node:console');
const otpSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        otpHash: {
            type: String,
            required: true,

        },
        attempts: {
            type: Number,
            default: 0,
        },
        expiresAt: {
            type: Date,
            required: true

        }
    },

    {
        timeStamp: true,
    },

);
otpSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);
const OTP = mongoose.model("OTP", otpSchema);
module.exports = OTP;