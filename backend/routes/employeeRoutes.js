const express = require("express");
const router = express.Router();
const {protected} = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const { createEmployee,getAllEmployee,getEmployeeById,deleteEmployee  } = require("../controllers/employeeController");
 
router.get("/",protected,authorize("permissions.manage"),getAllEmployee );
router.post("/",protected,authorize("permissions.manage"),createEmployee);
router.get("/:id",protected,authorize("permissions.manage"),getEmployeeById);
router.delete("/:id",protected,authorize("permissions.manage"),deleteEmployee);
router.patch("/:id/status",protected,authorize("permissions.manage"),deleteEmployee);

module.exports = router;

