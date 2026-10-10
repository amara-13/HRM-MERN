const mongoose = require("mongoose");
const roleSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    permissions:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Permission",
        },
    ],
    isSystem:{
        type:Boolean,
        default:false,
    },
},{
    timestamps:true
}
);
const Role = mongoose.model("Role",roleSchema);
module.exports = Role;
