const mongoose = require("mongoose");
const employeeSchema = mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        trim: true,
        // default: "",
        required:true,
    },
    profilePhoto: {
        type: String,
        default: "",
    },
    dateOfBirth: {
        type: Date,
        default: null,
    },
    gender: {
        type: String,
        enum: ['Female', 'Male', 'Other'],
        default: null,
    },
    cnic: {
        type: String,
        trim: true,
        default: "",
    },
    address: {
        street: {
            type: String,
            trim: true, default: ""
        },
        city: { type: String, trim: true, default: "" },
        country: { type: String, trim: true, default: "Pakistan" }
    },
    department: {
        type: mongoose.Types.ObjectId,
        ref: "Departments",
        required: true,
    },
    designation: {
        type: String,
        trim: true,
        required: true,
    },

    joiningDate: {
        type: Date,
        required: true,

    },
    employmentStatus: {
        type: String,
        enum: ["Active", "Probation", "Confirmed", "Notice Period", "Resigned", "Terminated"],
        default: "Probation"
    },
    employmentType: {
        type: String,
        enum: ["Full-time", "Part-time", "Contract", "Intern", "Temporary"],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        unique: true,
        sparse: true,
    },
    // branch: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Branch",
    //     // required:true,
    // },
    reportingManager: {
        type: mongoose.Types.ObjectId,
        ref: "Employee",
        default: null,
    },
    grade: {
        type: String,
        enum: ["Junior", "Mid-Level", "Senior", "Manager"],
        default: null,
    },
    probationEndDate: {
        type: Date,
        default: null,
    },
    workLocation: {
        type: String,
        enum: [
            "Head Office - Karachi",
            "Branch - Lahore",
            "Remote",
        ],
        default: null,
    },
    emergencyContact: {
        fullName: { type: String, trim: true, default: "" },
        relationship: {
            type: String,
            enum: ["Husand", "Father", "Mother", "Sister", "Brother", "Friend", "Other"],
            default:null,
        },
        phone: { type: String, trim: true, default: "" },
        address: { type: String, trim: true, default: "" },
    },
    bankDetails: {
        accountHolderName: { type: String, trim: true, default: "" },
        bankName: { type: String, trim: true, default: "" },
        accountNumber: { type: String, trim: true, default: "" },
        iban: { type: String, trim: true, default: "" },
    },
    basicSalary: {
        type: Number,
        min: 0,
        default: null,
    },
    payCycle: {
        type: String,
        enum: ["Monthly", "Bi-Weekly", "Weekly"],
        default: "Monthly"
    },
    documents: [
        {
            type: {
                type: String,
                enum: [
                    "CNIC/National ID",
                    "Employment Contract",
                    "Educational Certificate",
                    "Experience Letter",
                ],
                required: true,
            },
            filePath: {
                type: String,
                required: true,
            },
            originalName: {
                type: String,
                required: true,
            },
            mimeType: {
                type: String,
                required: true,
            },
            size: {
                type: Number,
                required: true,
            },
            expiryDate: {
                type: Date,
                default: null,
            },
        },
    ],
},
    {
        timestamps: true
    },
);
const Employee = mongoose.model("Employee", employeeSchema);
module.exports = { Employee };
