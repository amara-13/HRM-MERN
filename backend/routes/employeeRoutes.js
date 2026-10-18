const express = require("express");
const router = express.Router();
const {protected} = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const { createEmployee,
    getAllEmployee,
    getEmployeeById,
    deleteEmployee,
    updateJobDetails,
    updateEmploymentStatus,
    getEmployeesByDepartment,
    getDirectReports,
  } = require("../controllers/employeeController");
 
router.get("/",protected,authorize("employee.viewAll"),getAllEmployee );
router.post("/",protected,authorize("employee.create"),createEmployee);
router.get("/:id",protected,authorize("employee.view"),getEmployeeById);
router.delete("/:id",protected,authorize("employee.delete"),deleteEmployee);
router.patch("/status/:id",protected,authorize("employee.status.update"),updateEmploymentStatus);
router.patch("/:id/job-details",protected,authorize("employee.job.update"),updateJobDetails);
router.get("/department/:id",protected,authorize("employee.viewAll"),getEmployeesByDepartment);
router.get("/:id/direct-reports",protected,authorize("employee.viewAll"),getDirectReports);
module.exports = router;

