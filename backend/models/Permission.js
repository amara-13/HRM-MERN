const mongoose = require("mongoose");
const permissionSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    module:{
        type:String,
        required:true,
        trim:true,
    },
    action:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        trim:true,
        default:""
    },
    },{
        timestamps:true
    }
);
const Permission = mongoose.model("Permission",permissionSchema);
module.exports = Permission;