const mongoose = require("mongoose");
const employeeSchema  = mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true,
    },
    sequence:{
        type:Number,
        default:0,
    }
});
const EmployeeCounter = mongoose.model("EmployeeCounter",employeeSchema);
module.exports = {EmployeeCounter};
