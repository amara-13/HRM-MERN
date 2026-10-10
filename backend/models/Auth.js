const mongoose = require("mongoose");
const registerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true

  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  otp:{
   type: String,
   trim: true,
   default:null,
},
otpExpire:{
  type: Date,
   default:null,
},
otpVerification:{
  type:Boolean,
  default:false,
},
role:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Role",
  required:true,
},
isActive:{
  type:Boolean,
  default:true,
},
},

  {
    timestamps: true,
  }
);

const Register = mongoose.model("Users", registerSchema);
module.exports = Register;