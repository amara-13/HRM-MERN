const express = require("express");
const router = express.Router();
const authorize = require("../middleware/authorize");
const { protected } = require("../middleware/authMiddleware");
const {
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
  getAllDepartments,
} = require("../controllers/departmentController");

// Specific routes must come before parameterized :id route
router.get("/", protected, authorize("department.manage"), getAllDepartments);
router.get("/stats", protected, authorize("department.manage"), getDepartmentStats);
router.get("/active", protected, authorize("department.manage"), getActiveDepartments);
router.get("/inactive", protected, authorize("department.manage"), getInactiveDepartments);
router.get("/manager/:managerId", protected, authorize("department.manage"), getDepartmentsByManager);
router.get("/:id", protected, authorize("department.manage"), getDepartmentById);

router.post("/create", protected, authorize("department.manage"), createDepartment);

router.patch("/:id/activate", protected, authorize("department.manage"), activateDepartment);
router.patch("/:id/deactivate", protected, authorize("department.manage"), deactivateDepartment);
router.patch("/:id/assign-manager", protected, authorize("department.manage"), assignDepartmentManager);
router.patch("/:id/remove-manager", protected, authorize("department.manage"), removeDepartmentManager);

module.exports = router;
