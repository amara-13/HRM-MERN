const mongoose = require("mongoose");
const { Departments } = require("../models/Department");
const { Employee } = require("../models/Employee");
const { EmployeeCounter } = require("../models/EmployeeCounter");
const { sendError, sendResponse } = require("../helpers/errorHelper");
const {
    isValidEmail,
    isValidPhone,
    isValidName,
    isValidEmploymentStatus,
    isValidEmploymentType,
    isValidGender,
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
            const existReportingManager = await Employee.findById(reportingManager);
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
        const filter = {};
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

module.exports = {
    createEmployee,
    getAllEmployee
}; 