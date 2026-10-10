const mongoose = require("mongoose");
const connectionDB = async()=>{
    try{
        const con = await mongoose.connect(process.env.MONGO_URI);
        console.log(`mongoDB connect to ${con.connection.host} and Database is ${con.connection.name}`);
    }catch(error){
        console.log(`Error while make connection to db`,error.message);
    }
}
module.exports = connectionDB;