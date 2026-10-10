const mongoose = require("mongoose");
const Role = require("../models/Role");
const User = require("../models/Auth");
const Permission = require("../models/Permission");
const sendError = require("../helpers/errorHelper");
const { permission } = require("node:process");
const isNameValid = /^[A-Za-z\s]+$/;

const getRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate("permissions", "name module action").sort({ name: 1 });
    return res.status(200).json({
      success: true,
      message: "Roles fetched successfully",
      data: roles,
    });
  }
  catch (error) {
    console.error("Get roles error:", error.message);

    return sendError(
      res,
      "Failed to fetch roles",
      500
    );
  }
};

const getRole = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      console.log("Role ID:", id);

      return sendError(res, "id is missing", 400)
    }
    const validId = mongoose.Types.ObjectId.isValid(id);
    if (!validId) {
      return sendError(res, "Invalid role ID", 400)
    }

    const role = await Role.findById(id);

    if (!role) {
      return sendError(res, "Role not found", 404);

    }
    return res.status(200).json({
      success: true,
      message: "fetch role successfully",
      data: role
    });
  } catch (error) {
    console.error("Error fetching role:", error);

    return sendError(
      res,
      error.message,
      500
    );
  }
}
const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    if (typeof name !== "string" || !name.trim()) {
      return sendError(res, "name Name is required", 400);
    }
    const trimmedName = name.trim();
    const validName = isNameValid.test(trimmedName);
    if (!validName) {
      return sendError(res, "Role must  contain letter and whitespace", 400);
    }
    if (!Array.isArray(permissions)) {
      return sendError(res, "permission must be an array", 400);
    }
    if (permissions.some(
      (id) => !mongoose.Types.ObjectId.isValid(id)
    )) {
      return sendError(res, "one or more permission IDs are invalid", 400);
    }

    const existingRole = await Role.findOne({ name: trimmedName });
    if (existingRole) {
      return sendError(res, "Role with given name is already exist", 409);
    }
    const foundPermissions = await Permission.find({
      _id: { $in: permissions },
    });
    if (foundPermissions.length !== permissions.length) {
      return sendError(res, "permission Invalid or not found", 400);
    }
    const role = await Role.create({
      name: trimmedName,
      permissions: foundPermissions.map(
        (permission) => permission._id
      ),
    });
    return res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: role,
    });
  } catch (error) {
    console.error("Error creating role:", error);
    if (error.code === 11000) {
      return sendError(res, "Role with name already exists", 409);
    }
    return sendError(res, "Internal server error", 500);
  }
}
const updateRole = async (req,res)=>{
  try{
    const {id} = req.params;
    const {name,permissions} = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
      return sendError(res,"Invalid role Id",400);
    }
    
    const existingRole = await Role.findById(id);
    if(!existingRole){
      return sendError(res,"Role not Found",404);
    }
    if(existingRole.isSystem &&
      name!==undefined &&(
        typeof name !== "string" || name.trim() !== existingRole.name))
        {
          return sendError(res,"System role name  cannot be changed",403);
        }
        if(existingRole.name === "Super Admin" && 
          permissions!==undefined
        ){
          return sendError (res,"Super Admin permissions cannot  be changed",403);
        }

        const updates = {};
        if(name !==undefined){
          if(typeof name !=="string" || !name.trim()){
            return sendError(res,"Invalid role name",400);
          }
          const trimmedName = name.trim();
          const validName = isNameValid.test(trimmedName);
          if(!validName){
            return sendError(res,"Role name must contain only letters and spaces",400);
          }
        
        const duplicateRole = await Role.findOne({
        name:trimmedName,
        _id:{$ne:id},
        });
        if(duplicateRole){
          return sendError(res,"Role name Already axists",409);
        }
        updates.name = trimmedName;
      }
      if(permissions !==undefined){
        if(!Array.isArray(permissions)){
          return sendError(res,"Permission must be an array",400);}
          if(permissions.some((permissionId)=>!mongoose.Types.ObjectId.isValid(permissionId)))
          {return sendError(
          res,
          "One or more permission IDs are invalid",
          400
        )};  
      
      const uniquePermissionIds = new Set(
        permissions.map((permissionId)=>permissionId.toString()
      )
    );
    if(uniquePermissionIds.size !==permissions.length){
      return sendError(res,"Duplicate permission Ids are not allowed");
    }
    const foundPermissions = await Permission.find({
      _id:{$in:permissions},
    });
    if(foundPermissions.length !== permissions.length){
      return sendError(res, "One or more permissions were not found",400);
    }
    updates.permissions = foundPermissions.map(
      (permission)=>permission._id
    );
    }
    if(Object.keys(updates).length === 0){
      return sendError(res,"Provide at least one field to update",400);
    }

    const updatedRole = await Role.findByIdAndUpdate(
      id,
      {$set:updates},
      {
        new:true,
        runValidators:true,
      }
    );
  if(!updatedRole){
    return sendError(res,"Role not found",404);
  }
  return res.status(200).json({
    success:true,
    message:"Role updated Successfully",
    data:updatedRole
  });
  }catch(error){
    return sendError(res,error.message,500);
  }
}
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendError(res, "ID is missing", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, "Invalid ID", 400);
    }
    const existingRole = await Role.findById(id);

    if (!existingRole) {
      return sendError(res, "Role doesn't exist", 404);
    }
    if (existingRole.isSystem) {
      return sendError(
        res,
        "System roles cannot be deleted",
        403
      );
    }
    const assignedUser = await User.findOne({ role: id });
    if (assignedUser) {
      return sendError(
        res,
        "Cannot delete a role assigned to users",
        409
      );
    }
    await Role.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting role:", error);
    return sendError(res, "Internal server error", 500);
  }
};

module.exports = {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,

};

