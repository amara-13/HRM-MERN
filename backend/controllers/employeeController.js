const mongoose = require("mongoose");
const fs = require("fs");

const { Departments } = require("../models/Department");
const { Employee } = require("../models/Employee");
const Users = require("../models/Auth");
const { EmployeeCounter } = require("../models/EmployeeCounter");
const { sendError, sendResponse } = require("../helpers/errorHelper");
const {
    isValidEmail,
    isValidPhone,
    isValidName,
    isValidEmploymentStatus,
    isValidEmploymentType,
    isValidGender,
    isValidWorkLocation,
    isValidGrade,
    isValidPayCycle,
    isValidDocumentType,
} = require("../helpers/validationHelper");
const createEmployee = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, department, designation, joiningDate, employmentType, profilePhoto, dateOfBirth,
            gender, cnic, employmentStatus, grade, probationEndDate, workLocation, branch, reportingManager, user, address,
            emergencyContact, bankDetails, basicSalary, payCycle } = req.body;

        if (!firstName || !isValidName(firstName.trim())) {
            return sendError(res, "Valid first name is required (2-50 letters)", 400);
        }

        if (!lastName || !isValidName(lastName.trim())) {
            return sendError(res, "Valid last name is required (2-50 letters)", 400);
        }

        const cleanEmail = email ? email.trim().toLowerCase() : "";
        if (!cleanEmail || !isValidEmail(cleanEmail)) {
            return sendError(res, "Valid email address is required", 400);
        }

        if (!phone || !isValidPhone(phone.trim())) {
            return sendError(res, "Valid phone number is required (e.g. +923001234567 or 03001234567)", 400);
        }

        if (!designation || typeof designation !== "string" || !designation.trim()) {
            return sendError(res, "Designation is required", 400);
        }

        if (!employmentType || !isValidEmploymentType(employmentType)) {
            return sendError(res, "Valid employment type is required (Full-time, Part-time, Contract, Intern, Temporary)", 400);
        }

        const parseJoiningDate = new Date(joiningDate);
        if (!joiningDate || isNaN(parseJoiningDate.getTime())) {
            return sendError(res, "Valid joining date is required", 400);
        }

        if (gender && !isValidGender(gender)) {
            return sendError(res, "Invalid gender. Allowed: Female, Male, Other", 400);
        }

        if (employmentStatus && !isValidEmploymentStatus(employmentStatus)) {
            return sendError(res, "Invalid employment status", 400);
        }

        if (dateOfBirth && isNaN(new Date(dateOfBirth).getTime())) {
            return sendError(res, "Invalid date of birth", 400);
        }

        if (probationEndDate && isNaN(new Date(probationEndDate).getTime())) {
            return sendError(res, "Invalid probation end date", 400);
        }

        if (basicSalary !== undefined && basicSalary !== null && (!Number.isFinite(Number(basicSalary)) || Number(basicSalary) < 0)) {
            return sendError(res, "Basic salary must be a positive number", 400);
        }

        if (!department || !mongoose.Types.ObjectId.isValid(department)) {
            return sendError(res, "Invalid department ID", 400);
        }

        const existDepartment = await Departments.findById(department);
        if (!existDepartment) {
            return sendError(res, "Department not found", 404);
        }
        if (existDepartment.isActive !== true) {
            return sendError(res, "Department is not active", 409);
        }

        let validatedManagerId = null;
        if (reportingManager) {
            if (!mongoose.Types.ObjectId.isValid(reportingManager)) {
                return sendError(res, "Invalid reporting manager ID", 400);
            }
            const existReportingManager = await Employee.findOne({ _id: reportingManager, deletedAt: null });
            if (!existReportingManager) {
                return sendError(res, "Reporting manager employee not found", 404);
            }
            validatedManagerId = existReportingManager._id;
        }

        let validatedBranchId = null;
        // if (branch) {
        //     if (!mongoose.Types.ObjectId.isValid(branch)) {
        //         return sendError(res, "Invalid branch ID", 400);
        //     }
        validatedBranchId = branch;
        // }

        let validatedUserId = null;
        if (user) {
            if (!mongoose.Types.ObjectId.isValid(user)) {
                return sendError(res, "Invalid user ID", 400);
            }
            validatedUserId = user;
        }

        if (validatedUserId) {
            const userExist = await Employee.findOne({ user: validatedUserId });
            if (userExist) {
                return sendError(res, "An employee with this user already exists", 409);
            }
        }

        const emailExist = await Employee.findOne({ email: cleanEmail });
        if (emailExist) {
            return sendError(res, "An employee with this email already exists", 409);
        }

        const createEmployeeId = await EmployeeCounter.findOneAndUpdate(
            { name: "employeeId" },
            { $inc: { sequence: 1 } },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
            }
        );

        if (!createEmployeeId) {
            return sendError(res, "Failed to create employee ID", 400);
        }

        const employeeId = `EMP-${String(createEmployeeId.sequence).padStart(4, "0")}`;

        const createdEmployee = await Employee.create({
            employeeId,

            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: cleanEmail,
            phone: phone.trim(),
            profilePhoto: profilePhoto || "",
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            gender: gender || null,
            cnic: cnic ? cnic.trim() : "",

            department,
            designation: designation.trim(),
            joiningDate: parseJoiningDate,
            employmentType,
            employmentStatus: employmentStatus || "Probation",
            grade: grade || null,
            probationEndDate: probationEndDate ? new Date(probationEndDate) : null,
            workLocation: workLocation || null,

            branch: validatedBranchId,
            reportingManager: validatedManagerId,
            user: validatedUserId,

            basicSalary: basicSalary !== undefined && basicSalary !== null ? Number(basicSalary) : null,
            payCycle: payCycle || "Monthly",

            address: {
                street: address?.street?.trim() || "",
                city: address?.city?.trim() || "",
                country: address?.country?.trim() || "Pakistan",
            },
            emergencyContact: {
                fullName: emergencyContact?.fullName?.trim() || "",
                relationship: emergencyContact?.relationship?.trim() || null,
                phone: emergencyContact?.phone?.trim() || "",
                address: emergencyContact?.address?.trim() || "",
            },
            bankDetails: {
                accountHolderName: bankDetails?.accountHolderName?.trim() || "",
                bankName: bankDetails?.bankName?.trim() || "",
                accountNumber: bankDetails?.accountNumber?.trim() || "",
                iban: bankDetails?.iban?.trim() || "",
            },
        });

        await createdEmployee.populate("department", "name");
        if (validatedManagerId) {
            await createdEmployee.populate("reportingManager", "firstName lastName employeeId");
        }

        return res.status(201).json({
            success: true,
            message: "Employee created successfully",
            data: createdEmployee,
        });

    } catch (error) {
        console.error("Error while creating employee:", error);

        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((err) => err.message);
            return sendError(res, messages.join(", "), 400);
        }

        if (error.name === "CastError") {
            return sendError(res, `Invalid format for field: ${error.path}`, 400);
        }
        if (error.code === 11000) {
            const duplicatedField = Object.keys(error.keyPattern || {})[0] || "field";
            return sendError(res, `An employee with this ${duplicatedField} already exists`, 409);
        }

        return sendError(res, "Internal server error", 500);
    }
};
const getAllEmployee = async (req, res) => {
    try {
        const { page, limit, search, employmentType, employmentStatus, sortBy, order, } = req.query;

        const pageData = Number(page) || 1;
        const limitData = Number(limit) || 14;
        const skip = (pageData - 1) * limitData;
        const maxLimit = 100;
        if (!Number.isInteger(pageData) || pageData < 1 || !Number.isInteger(limitData) || limitData < 1) {
            return sendError(res, "Page and Limit must be positive integers", 400);
        }
        if (limitData > maxLimit) {
            return sendError(res, `Limit cannot Exceed ${maxLimit}`, 400);
        }
        const allowedSortFields = [
            "joiningDate",
            "firstName",
            "lastName",
            "createdAt",
        ];
        const sortField = sortBy || "joiningDate";
        const sortDirection = order || "desc";

        if (!allowedSortFields.includes(sortField)) {
            return sendError(res, "Invalid sort field", 400);
        };
        if (!["asc", "desc"].includes(sortDirection)) {
            return sendError(res, "Order must be either asc or desc", 400);
        }
        const sortOptions = {
            [sortField]: sortDirection === "asc" ? 1 : -1,
        };
        const filter = { deletedAt: null, };
        if (search && search.trim()) {
            const searchTerm = search.trim().replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            filter.$or = [
                { firstName: { $regex: searchTerm, $options: "i" } },
                { lastName: { $regex: searchTerm, $options: "i" } },
                { email: { $regex: searchTerm, $options: "i" } },
            ];
        }

        if (employmentStatus) {
            filter.employmentStatus = employmentStatus;

        }
        if (employmentType) {
            filter.employmentType = employmentType;
        }



        const employee = await Employee.find(filter)
            .sort(sortOptions).skip(skip).limit(limitData)
            .populate("department", "name")
            .populate("reportingManager", "firstName lastName employeeId");
        const totalEmployees = await Employee.countDocuments(filter);
        const totalPages = Math.ceil(totalEmployees / limitData);

        return sendResponse(res, "get employees successfully", 200, {
            employees: employee,
            pagination: {
                page: pageData,
                limit: limitData,
                totalEmployees,
                totalPages,
                hasNextPage: pageData < totalPages,
                hasPreviousPage: pageData > 1,
            },
        });
    } catch (error) {
        console.error("Error while fetching all employees:", error);
        return sendError(res, "internal server error", 500);
    }
};
const getEmployeeById = async (req, res) => {
    try {
        console.log("getEmployeeById controller called");
        console.log("Request params:", req.params);
        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return sendError(res, "Invalid Id", 400);
        }
        const existingEmployee = await Employee.findOne({ _id: id, deletedAt: null });
        if (!existingEmployee) {
            return sendError(res, "Employee not found", 404);
        }
        const employee = await existingEmployee.populate("department", "name").populate("reportingManager", "firstName lastName employeeId");
        return sendResponse(res, "fetch user successfully", 200, employee);
    } catch (error) {
        console.error("Error while fetching employee by Id", error);
        return sendError(res, "Internal server Error", 500);
    }
}
const deleteEmployee = async (req, res) => {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return sendError(res, "Invalid Id", 400);
    }
    if (!req.user?._id) {
        return sendError(res, "Authenticated User not found", 401);
    }
    let session;
    let result = null;
    try {
        session = await mongoose.startSession();
        await session.withTransaction(async () => {
            const employee = await Employee.findById(id);
            if (!employee) {
                result = {
                    success: false,
                    message: "Employee not found",
                    statusCode: 404,
                };
                return;
            }
            if (employee.deletedAt !== null || employee.employmentStatus === "Terminated") {

                result = {
                    success: false,
                    message: "Employee already terminated",
                    statusCode: 409,
                };
                return;
            }
            if (employee.user) {
                const user = await Users.findById(employee.user);
                if (user && user.isActive !== true) {
                    result = {
                        success: false,
                        message: "Employee user account is already deactivated",
                        statusCode: 409,
                    };
                    return;
                }
                if (user) {
                    user.isActive = false;
                    await user.save({ session });
                }
            }

            employee.employmentStatus = "Terminated";
            employee.deletedAt = new Date();
            employee.deletedBy = req.user._id;
            await employee.save({ session });
            await Departments.updateMany(
                { manager: employee._id }, { $set: { manager: null } }, { session }
            );
            await Employee.updateMany({ reportingManager: employee._id }, { $set: { reportingManager: null } }, { session });
            result = {
                success: true,
                message: "Employee terminated successfully",
                statusCode: 200,
            };
        })
        if (!result || !result.success) {
            return sendError(
                res,
                result?.message || "Employee termination failed",
                result?.statusCode || 500
            );
        }

        return sendResponse(
            res,
            result.message,
            result.statusCode
        );

    } catch (error) {
        console.log("Error while deleting the employee", error);
        return sendError(res, "Interval Server Error", 500);
    } finally {
        if (session) {
            await session.endSession();
        }
    }
}
const updateEmploymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { employeeStatus, reason } = req.body;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return sendError(res, "Invalid Id", 400);
        }
        if (!employeeStatus || !isValidEmploymentStatus(employeeStatus)) {
            return sendError(res, "Invalid Status", 400);
        }

        const employee = await Employee.findOne({ _id: id, deletedAt: null });

        if (!employee) {
            return sendError(res, "Employee not found", 404);
        }

        if (employee.deletedAt !== null || ["Terminated", "Resigned"].includes(employee.employmentStatus)) {
            return sendError(res, "Employee has already left the company", 409);
        } 
            if (["Terminated", "Resigned"].includes(employeeStatus)) {
                const user = await Users.findById(employee.user);
                if (!user) {
                    return sendError(res, "Employee User Account Not Found", 404);
                }
                if (user.isActive === true) {
                    user.isActive = false;
                    await user.save();
                };
            await Departments.updateMany({ manager: employee._id }, { $set: { manager: null } });
            employee.deletedAt = new Date();}
           employee.employmentStatus = employeeStatus;

        if (typeof reason !== "string" || !reason.trim()) {
            return sendError(res, "Reason is require to update employment status", 400);
        }
        employee.statusUpdateReason = reason;
        await employee.save();
        return sendResponse(res, "update status successfully", 200, employee);

    } catch (error) {
        console.error("Error updating employment status:", error);
        return sendError(res, "Internal Server Error", 500);
    }
}
const updateJobDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            department,
            designation,
            grade,
            reportingManager,
            employmentType,
            workLocation,
        } = req.body;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return sendError(res, "Invalid employee ID format", 400);
        }
        if (
            department === undefined &&
            designation === undefined &&
            grade === undefined &&
            reportingManager === undefined &&
            employmentType === undefined &&
            workLocation === undefined
        ) {
            return sendError(res, "At least one job detail field must be provided to update", 400);
        }

        const employee = await Employee.findOne({ _id: id, deletedAt: null });
        if (!employee) {
            return sendError(res, "Employee not found", 404);
        }
        if (["Terminated", "Resigned"].includes(employee.employmentStatus) || employee.deletedAt !== null) {
            return sendError(res, "Cannot update job details for a terminated or resigned employee", 400);
        }
        if (department !== undefined) {
            if (!department || !mongoose.Types.ObjectId.isValid(department)) {
                return sendError(res, "Invalid department ID", 400);
            }
            const existingDepartment = await Departments.findById(department);
            if (!existingDepartment) {
                return sendError(res, "Department not found", 404);
            }
            if (existingDepartment.isActive !== true) {
                return sendError(res, "Selected department is inactive", 400);
            }
            employee.department = department;
        }
        if (designation !== undefined) {
            if (typeof designation !== "string" || !designation.trim()) {
                return sendError(res, "Valid designation is required", 400);
            }
            employee.designation = designation.trim();
        }
        if (reportingManager !== undefined) {
            if (reportingManager === null) {
                employee.reportingManager = null;
            } else {
                if (!mongoose.Types.ObjectId.isValid(reportingManager)) {
                    return sendError(res, "Invalid reporting manager ID", 400);
                }

                if (reportingManager.toString() === id) {
                    return sendError(res, "An employee cannot be their own reporting manager", 409);
                }

                const existingReportingManager = await Employee.findOne({ _id: reportingManager, deletedAt: null });
                if (!existingReportingManager) {
                    return sendError(res, "Reporting manager not found", 404);
                }

                if (["Terminated", "Resigned"].includes(existingReportingManager.employmentStatus)) {
                    return sendError(res, "Reporting manager has already left the company", 409);
                }

                if (existingReportingManager.reportingManager?.toString() === id) {
                    return sendError(res, "Circular reporting detected. This manager already reports to this employee", 400);
                }

                employee.reportingManager = reportingManager;
            }
        }
        if (grade !== undefined) {
            if (grade !== null && !isValidGrade(grade)) {
                return sendError(res, "Invalid grade. Allowed: Junior, Mid-Level, Senior, Manager", 400);
            }
            employee.grade = grade;
        }
        if (employmentType !== undefined) {
            if (!isValidEmploymentType(employmentType)) {
                return sendError(res, "Invalid employment type", 400);
            }
            employee.employmentType = employmentType;
        }
        if (workLocation !== undefined) {
            if (workLocation !== null && !isValidWorkLocation(workLocation)) {
                return sendError(res, "Invalid work location", 400);
            }
            employee.workLocation = workLocation;
        }

        await employee.save();
        await employee.populate("department", "name");
        await employee.populate("reportingManager", "firstName lastName employeeId");

        return sendResponse(
            res,
            "Employee job details updated successfully",
            200,
            employee
        );

    } catch (error) {
        console.error("Error while updating job details:", error);
        return sendError(res, "Internal Server Error", 500);
    }
};
const getEmployeesByDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.query;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return sendError(res, "Invalid Id", 400);
        }
        const existingDepartment = await Departments.findById(id);
        if (!existingDepartment) {
            return sendError(res, "Department not found", 404);
        }
        if (existingDepartment.isActive !== true) {
            return sendError(res, "Department is not active", 409);
        }
        if (status !== undefined) {
            if (typeof status !== "string" || !isValidEmploymentStatus(status)) {
                return sendError(res, "Invalid employment status", 400);
            }

        }
        const query = {
            department: existingDepartment._id,
            deletedAt: null,
        };

        if (status !== undefined) {
            query.employmentStatus = status;
        }

        const employees = await Employee.find(query).select("firstName  lastName email employeeId designation phone employmentType employmentStatus profilePhoto")
            .populate("department", "name").populate("reportingManager", "firstName lastName email");

        return res.status(200).json({
            success: true,
            message: "Employees fetched successfully",
            count: employees.length,
            data: employees
        });
    }

    catch (error) {
        console.log("Error While Fetching Employees by Department Id", error);
        return sendError(res, "Interval Server Error", 500);
    }
};
const getDirectReports = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return sendError(res, "Invalid Id", 400);
        }
        const manager = await Employee.findById(id);
        if (!manager) {
            return sendError(res, "manager not found", 404);
        }
        if (manager.deletedAt != null) {
            return sendError(res, "manager is not active or may be deleted", 409);
        }

        const employees = await Employee.find({ reportingManager: manager._id, _id: { $ne: manager._id }, deletedAt: null }).select(
            "firstName lastName employeeId designation email phone employmentStatus profilePhoto"
        ).populate("department", "name").populate("reportingManager", "firstName lastName email employeeId");

        return res.status(200).json({
            success: true,
            message: "fetch employees by manager Id sucsessfully",
            data: employees,
            count: employees.length,

        });

    } catch (error) {
        console.log("Error while fetching direct reports", error);
        return sendError(res, "Internnal Server Error", 500);
    }
};
const getEmployeeStats = async (req, res) => {
    try {
        console.log("djfodfjdo");
        const totalEmployees = await Employee.countDocuments({ deletedAt: null });
        const activeEmployees = await Employee.countDocuments({ employmentStatus: "Active", deletedAt: null });
        const probationEmployees = await Employee.countDocuments({ employmentStatus: "Probation", deletedAt: null });
        const terminatedEmployees = await Employee.countDocuments({ employmentStatus: "Terminated" });
        const resignedEmployees = await Employee.countDocuments({ employmentStatus: "Resigned" });
        const byEmploymentType = await Employee.aggregate([
            { $match: { deletedAt: null } },
            { $group: { _id: "$employmentType", count: { $sum: 1 } } }
        ]);
        return sendResponse(res, "Employee Statistics fetched successfully", 200, {
            summary: {
                total: totalEmployees,
                active: activeEmployees,
                probation: probationEmployees,
                terminated: terminatedEmployees,
                resigned: resignedEmployees,
            }, byEmploymentType,
        });
    } catch (error) {
        console.log("Error while fetching employee stats", error);
        return sendError(res, "Internal Server Error", 500);
    }
};

const uploadEmployeeDocument = async (req, res) => {
    const removeFile = () => {
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error deleting file:", err);
            });
        }
    };

    try {
        const { id } = req.params;
        const { type } = req.body;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            removeFile();
            return sendError(res, "Invalid employee ID", 400);
        }

        if (!req.file) {
            return sendError(res, "File is required", 400);
        }

        if (!type || !isValidDocumentType(type)) {
            removeFile();
            return sendError(res, "Invalid document type", 400);
        }

          const employee = await Employee.findOne({ _id: id, deletedAt: null });
        if (!employee) {
            removeFile();
            return sendError(res, "Employee not found", 404);
        }

        const newDoc = {
            type,
            filePath: req.file.path,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
        };

        employee.documents.push(newDoc);
        await employee.save();

        const createdDocumentObject = employee.documents[employee.documents.length - 1];

        return sendResponse(res, "Document uploaded successfully", 201, createdDocumentObject);
    } catch (error) {
        removeFile();
        console.error("Error while uploading employee document:", error);
        return sendError(res, "Upload or database failure", 500);
    }
};

const deleteEmployeeDocument = async (req, res) => {
    try {
        const { id, docId } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return sendError(res, "Invalid employee ID", 400);
        }
        if (!docId || !mongoose.Types.ObjectId.isValid(docId)) {
            return sendError(res, "Invalid document ID", 400);
        }
        const employee = await Employee.findOne({
            _id: id,
            deletedAt: null,
        });
        if (!employee) {
            return sendError(res, "Employee not found", 404);
        }
        const document = await employee.documents.id(docId);

        if (!document) {
            return sendError(res, "Employee document not found", 404);
        }
        const fs = require("fs/promises");
        const filePath = document.filePath;
        document.deleteOne();
        await employee.save();
        if (filePath) {
            try {
                await fs.unlink(filePath);
            } catch (fileError) {
                if (fileError.code !== "ENOENT") {
                    console.error( "Document removed from database, but file deletion failed:",fileError);
                }
            }
        }
        return sendResponse(
            res,"Employee document deleted successfully",200
        );

    } catch (error) {
        console.error("Error while deleting employee document:", error);

        return sendError(res,"Failed to delete employee document", 500);
    }
};

module.exports = {
    createEmployee,
    getAllEmployee,
    getEmployeeById,
    deleteEmployee,
    updateEmploymentStatus,
    updateJobDetails,
    getEmployeesByDepartment,
    getDirectReports,
    getEmployeeStats,
    uploadEmployeeDocument,
    deleteEmployeeDocument,
};