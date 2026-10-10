const Role = require("../../models/Role");
const Permission = require("../../models/Permission");
const roles = {
     "Super Admin": [
    "employee.view",
    "employee.create",
    "employee.update",
    "employee.delete",
    "attendance.viewAll",
    "leave.apply",
    "leave.approve",
    "payroll.run",
    "payroll.viewOwn",
    "role.manage",
     ],
     "HR Admin": [
    "employee.view",
    "employee.create",
    "employee.update",
    "attendance.viewAll",
    "leave.approve",
    "payroll.run",
  ],
  Manager: [
    "employee.view",
    "attendance.viewAll",
    "leave.apply",
    "leave.approve",
    "payroll.viewOwn",
  ],
  Employee: [
    "leave.apply",
    "payroll.viewOwn",
  ],
};
 const seedRoles = async()=>{
  for(const[roleName,permissionName] of Object.entries(roles)){
    const permissions  = await Permission.find({
      name:{
        $in:permissionName
      },
    });
    if(permissions.length !==permissionName.length){
      const foundPermission = permissions.map((permission)=>permission.name);
    
    const missingPermissions = permissionName.filter(
      (permissionName)=>!foundPermission.includes(permissionName)
    
    );throw new Error(
      `Missing permission for ${roleName}:${missingPermissions.join(",")}`
    );  
    }
const permissionIds = permissions.map(
  (permission)=>permission._id
);
await Role.updateOne(
  {name:roleName},
  {
    $set:{
      name:roleName,
      permissions:permissionIds,
      isSystem:true,
    },
  },
  {upsert:true}
);
}
console.log("Roles seeded successfully");

 };
 module.exports = {seedRoles,

 };