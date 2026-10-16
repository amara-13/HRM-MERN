const express = require("express");
const router = express.Router();
const {protected} = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const { createEmployee,getAllEmployee  } = require("../controllers/employeeController");
 
router.get("/",protected,authorize("permissions.manage"),getAllEmployee );
router.post("/",protected,authorize("permissions.manage"),createEmployee);
// router.patch("/:id",protected,authorize("permissions.manage"),updatePermissions);
// router.delete("/:id",protected,authorize("permissions.manage"),deletePermission);

module.exports = router;

