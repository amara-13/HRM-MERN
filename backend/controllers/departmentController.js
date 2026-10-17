
const mongoose = require("mongoose");
const { Departments } = require("../models/Department");
const { Employee } = require("../models/Employee");
const {sendError} = require("../helpers/errorHelper");

const createDepartment = async (req, res) => {
  try {
    const { name, description, manager } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return sendError(
        res,
        "Department name is required",
        400
      );
    }

    const cleanName = name.trim();

    if (cleanName.length < 2 || cleanName.length > 100) {
      return sendError(
        res,
        "Department name must be between 2 and 100 characters",
        400
      );
    }

    if (description !== undefined && typeof description !== "string") {
      return sendError(
        res,
        "Description must be a string",
        400
      );
    }

    const cleanDescription = description?.trim() || "";

    if (cleanDescription.length > 500) {
      return sendError(
        res,
        "Description cannot exceed 500 characters",
        400
      );
    }

    const existingDepartment = await Departments.findOne({
      name: cleanName,
    }).collation({ locale: "en", strength: 2 });

    if (existingDepartment) {
      return sendError(
        res,
        "Department already exists",
        409
      );
    }

    let managerId = null;

    if (manager !== undefined && manager !== null && manager !== "") {
      if (!mongoose.Types.ObjectId.isValid(manager)) {
        return sendError(res, "Invalid manager ID", 400);
      }

      const existingEmployee = await Employee.findById(manager);

      if (!existingEmployee) {
        return sendError(res, "Manager employee not found", 404);
      }

      managerId = existingEmployee._id;
    }

    const department = await Departments.create({
      name: cleanName,
      description: cleanDescription,
      manager: managerId,
    });

    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
    });
  } catch (error) {
    console.error("Error creating department:", error);

    if (error.code === 11000) {
      return sendError(res, "Department already exists", 409);
    }

    return sendError(res, "Internal server error", 500);
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, "invalid Id", 400);
    }
    const existingDeparment = await Departments.findById(id).populate("manager", "firstName lastName email employeeId");
    if (!existingDeparment) {
      return sendError(res, "department not found", 404);
    }
    return res.status(200).json({
      success: true,
      message: "fetch department details successfully",
      data: existingDeparment,
    });
  } catch (error) {
    console.error("Error fetching department:", error);
    return sendError(res, "internal server Error", 500);
  };
};

const deactivateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, "id is invalid", 400);
    }
    const existingDepartment = await Departments.findById(id);
    if (!existingDepartment) {
      return sendError(res, "department not found", 404);
    }
    if (existingDepartment.isActive === false) {
      return sendError(res, "Department is already inactive", 409);
    }
    existingDepartment.isActive = false;
    await existingDepartment.save();
    return res.status(200).json({
      success: true,
      message: "Department deactivate successfully",
      data: existingDepartment
    });
  } catch (error) {
    console.error("Error while deactivate the department", error);
    return sendError(res, "internal server error", 500);
  }
};

const activateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, "id is invalid", 400);
    }
    const existingDepartment = await Departments.findById(id);
    if (!existingDepartment) {
      return sendError(res, "department not found", 404);
    }
    if (existingDepartment.isActive === true) {
      return sendError(res, "Department is already active", 409);
    }
    existingDepartment.isActive = true;
    await existingDepartment.save();
    return res.status(200).json({
      success: true,
      message: "Department activated successfully",
      data: existingDepartment
    });
  } catch (error) {
    console.error("Error while activate the department", error);
    return sendError(res, "internal server error", 500);
  }
};
const getActiveDepartments = async (req, res) => {
  try {

    const activeDeparment = await Departments.find({ isActive: true })
    if (activeDeparment.length === 0) {
      return res.status(200).json({
        success: true,
        message: "There is no active deparment",
        data: activeDeparment,
      });
    }
    return res.status(200).json({
      success: true,
      message: "fetch department details successfully",
      data: activeDeparment,
    });
  } catch (error) {
    console.error("Error fetching department:", error);
    return sendError(res, "internal server Error", 500);
  };
};
const getInactiveDepartments = async (req, res) => {
  try {

    const inActiveDeparment = await Departments.find({ isActive: false })
    if (inActiveDeparment.length === 0) {
      return res.status(200).json({
        success: true,
        message: "There is no inactive department",
        data: inActiveDeparment,
      });
    }
    return res.status(200).json({
      success: true,
      message: "fetch department details successfully",
      data: inActiveDeparment,
    });
  } catch (error) {
    console.error("Error fetching department:", error);
    return sendError(res, "internal server Error", 500);
  };
};
const assignDepartmentManager = async (req, res) => {
  try {
    const { id } = req.params;
    const { manager } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, "Invalid deparment id", 400);
    }
    if (!manager || !mongoose.Types.ObjectId.isValid(manager)) {
      return sendError(res, "invalid manager Id", 400);
    }
    const existDepartment = await Departments.findById(id);
    if (!existDepartment) {
      return sendError(res, "department not found", 404);
    }
    const existManager = await Employee.findById(manager);
    if (!existManager) {
      return sendError(res, "manager not found", 404);
    }
    existDepartment.manager = manager;
    await existDepartment.save();
    return res.status(200).json({
      success: true,
      message: "assign manager successfully",
      data: existDepartment,

    });

  } catch (error) {
    console.log("error to assign manager to the department", error);
    return sendError(res, "Internal server error", 500)
  };
};
const removeDepartmentManager = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, "Invalid deparment id", 400);
    }

    const existDepartment = await Departments.findById(id);
    if (!existDepartment) {
      return sendError(res, "department not found", 404);
    }
    if (!existDepartment.manager) {
      return sendError(res, "there is no manager to the given department", 409);
    }
    existDepartment.manager = null;
    await existDepartment.save();
    return res.status(200).json({
      success: true,
      message: "remove manager successfully",
      data: existDepartment,

    });

  } catch (error) {
    console.log("Error while removing department manager", error);
    return sendError(res, "Internal server error", 500)
  };
};
const getDepartmentsByManager = async (req, res) => {
  try {
    const { managerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(managerId)) {
      return sendError(res, "invalid manager Id", 400);
    }
    const existManager = await Employee.findById(managerId);
    if (!existManager) {
      return sendError(res, "manager not found", 404);
    }
    const data = await Departments.find({ manager: managerId }).populate(
      "manager",
      "firstName lastName email employeeId"
    );

    return res.status(200).json({
      success: true,
      message: "Departments fetched successfully",
      data: data,
    });

  } catch (error) {
    console.log("Error while fetching department with manager", error);
    return sendError(res, "internal server error", 500);

  }
};
const getDepartmentStats = async (req, res) => {
  try {
    const data = {};
    const departmentCount = await Departments.countDocuments();
    const inactiveDepartmentCount = await Departments.countDocuments({ isActive: false });
    const activeDepartmentCount = await Departments.countDocuments({ isActive: true });
    data.departmentCount = departmentCount;
    data.inactiveDepartmentCount = inactiveDepartmentCount;
    data.activeDepartmentCount = activeDepartmentCount;
    return res.status(200).json({
      success: true,
      message: "Department statistics fetched successfully",
      data: data,
    });

  } catch (error) {
    console.error("Error while getting department by stats", error);
    return sendError(res, "internal server Error", 500);

  }
};

const getAllDepartments = async (req, res) => {
  try {
    const departments = await Departments.find()
      .populate("manager", "firstName lastName email employeeId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Fetched all departments successfully",
      count: departments.length,
      data: departments,
    });
  } catch (error) {
    console.error("Error fetching all departments:", error);
    return sendError(res, "Internal server error", 500);
  }
};

module.exports = {
  createDepartment,
  getDepartmentById,
  deactivateDepartment,
  activateDepartment,
  getActiveDepartments,
  getInactiveDepartments,
  assignDepartmentManager,
  removeDepartmentManager,
  getDepartmentsByManager,
  getDepartmentStats,
  getAllDepartments
};
