const Permission  = require("../../models/Permission");

const permissions = [
    {
        name:"employee.view",
        module:"employee",
        action:"view",
        description:"view employees",
    },
    {
    name: "employee.create",
    module: "employee",
    action: "create",
    description: "Create employees",
  },
  {
    name: "employee.update",
    module: "employee",
    action: "update",
    description: "Update employees",
  },
  {
    name: "employee.delete",
    module: "employee",
    action: "delete",
    description: "Delete employees",
  },
  {
    name: "attendance.viewAll",
    module: "attendance",
    action: "viewAll",
    description: "View all employee attendance",
  },
  {
    name: "leave.apply",
    module: "leave",
    action: "apply",
    description: "Apply for leave",
  },
  {
    name: "leave.approve",
    module: "leave",
    action: "approve",
    description: "Approve employee leave",
  },
  {
    name: "payroll.run",
    module: "payroll",
    action: "run",
    description: "Run payroll",
  },
  {
    name: "payroll.viewOwn",
    module: "payroll",
    action: "viewOwn",
    description: "View own payroll",
  },
  {
    name: "role.manage",
    module: "role",
    action: "manage",
    description: "Manage roles and permissions",
  },
];

const seedPermissions = async()=>{
    for(const permission of permissions) {
        await Permission.findOneAndUpdate(
            {name:permission.name},
            permission,
            {
                upsert:true,
                new:true,
                setDefaultsOnInsert:true,
            }
        );
    };
 console.log("Permissions seeded successfully");
};
module.exports = { seedPermissions };


