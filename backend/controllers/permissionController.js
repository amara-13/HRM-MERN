const sendError = require("../helpers/errorHelper");
const Permission = require('../models/Permission');


const createPermission = async (req, res) => {
    try {
        const { name, module, action, description } = req.body;

        if (!name || !module || !action) {
            return sendError(res, "Name,module and action are required", 400);

        }
        if (typeof name !== "string" ||
            typeof module !== "string" ||
            typeof action !== "string" ||
            (description !== undefined &&
                typeof description !== "string")
        ) {
            return sendError(res, "Invalid fields types", 400);
        }
        const cleanName = name.trim();
        const cleanModule = module.trim();
        const cleanAction = action.trim();
        const cleanDescription = description?.trim() || " ";
        if (!cleanName || !cleanModule || !cleanAction) {
            return sendError(res, "Name,module and action cannot be empty", 400);
        }
        const existingPermission = await Permission.findOne({
            name: cleanName,
        });
        if (existingPermission) {
            return sendError(res, "Permission name already exists", 409);
        }
        const permission = await Permission.create({
            name: cleanName,
            module: cleanModule,
            action: cleanAction,
            description: cleanDescription,
        });
        return res.status(201).json({
            success: true,
            message: "Permission created successfully",
            data: permission,
        });

    }
    catch (error) {
        console.error("Error creating permission:", error);

        if (error.code === 11000) {
            return sendError(res, "Permission name already exists", 409);
        }
        return sendError(res, "Internal server error", 500);
    }
}

const getPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find().sort({
            module: 1,
            action: 1,
        });

        return res.status(200).json({
            success: true,
            message: "Permissions fetched successfully",
            count: permissions.length,
            data: permissions,
        });
    } catch (error) {
        console.error("Error fetching permissions:", error);
        return sendError(res, "Internal server error", 500);
    }
};

const updatePermissions = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, module, action, description } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendError(res, "Invalid permission ID", 400);
        }
        const existingPermission = await Permission.findById(id);
        if (!existingPermission) {
            return sendError(res, " permission not found", 404);
        }
        if (
            (name !== undefined && typeof name !== "string") ||
            (module !== undefined && typeof module !== "string") ||
            (action !== undefined && typeof action !== "string") ||
            (description !== undefined && typeof description !== "string")
        ) {
            return sendError(res, "Invalid field types", 404);
        }
        const updates = {};
        if (name !== undefined) {
            updates.name = name.trim();
        }
        if (!updates.name) {
            return sendError(res, "Name connot be empty", 404);
        }
        const duplicates = await Permission.find({
            name: updates,
            id: { $ne: id },
        });
        if (duplicates) {
            return sendError(res, "Permission name already exists", 409);
        }
        if (module !== undefined) {
            updates.module = module.trim();

            if (!updates.module) {
                return sendError(res, "Module cannot be empty", 400);
            }

        }
        if (action !== undefined) {
            updates.action = action.trim();

            if (!updates.action) {
                return sendError(res, "Action cannot be empty", 400);
            }
        }

        if (description !== undefined) {
            updates.description = description.trim();
        }
        const updatePermission = await Permission.findByIdAndUpdate(id,
            { $set: updates },
            {
                new: true,
                runValidators: true,
            }
        );
        return res.status(200).json({
            success: true,
            message: "Permission updated successfully",
            data: updatedPermission,
        });
    } catch (error) {
        console.error("Error updating permission:", error);

        if (error.code === 11000) {
            return sendError(res, "Permission name already exists", 409);
        }

        return sendError(res, "Internal server error", 500);
    }
};

const deletePermission = async(req,res)=>{
    try{
        const{id} = req.params;
        if(moongoose.Types.ObjectId,isValid(id)){
            return sendError(res,"Invalid permission ID",400);
        }
        const permission = await Permission.findById(id);
        if(!permission){
            return sendError(res,"permission not found",404);
        };
        const assignedRole = await Role.findOne({permissions:id});
        if(assignedRole){
            return sendError(res, "Cannot delete permission because it is assigned to a role",409);
        }
        await Permission.findByIdAndDelete(id);
         return res.status(200).json({
      success: true,
      message: "Permission deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting permission:", error);
    return sendError(res, "Internal server error", 500);
  }
};
  
module.exports = {
    createPermission,
    getPermissions,
    updatePermissions,
    deletePermission
};