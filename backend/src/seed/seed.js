require("dotenv").config();
const mongoose = require("mongoose");
const {seedPermissions} = require("./seedPermissions");
const{seedRoles} = require("./seedRoles");

const seed = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected");
        
        await seedPermissions();
        await seedRoles();

       console.log("seeding completed successfully");

       await mongoose.disconnect();
       process.exit(0);
    }catch(error){
        console.error("seeding failed:",error.message);
        await mongoose.disconnect();
        process.exit(1);
    }
};
seed();