const mongoose = require('mongoose');
const departmentSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        default: "",
    },
    manager: {
        type: mongoose.Types.ObjectId,
        ref: "Employee",
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true,

    },
}, {
    timestamps: true,
},
);

departmentSchema.index(
    { name: 1 },
    { unique: true, collation: { locale: "en", strength: 2 } }
);

const Departments = mongoose.model('Departments', departmentSchema);
module.exports = { Departments }

