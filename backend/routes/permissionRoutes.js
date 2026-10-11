const express = require("express");
const router = express.Router();
const {protected} = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const {createPermission,getPermissions,updatePermissions,deletePermission
    
} = require("../controllers/permissionController");
 
router.get("/",protected,authorize("permissions.manage"),getPermissions);
router.post("/create",protected,authorize("permissions.manage"),createPermission);
router.patch("/:id",protected,authorize("permissions.manage"),updatePermissions);
router.delete("/:id",protected,authorize("permissions.manage"),deletePermission);

module.exports = router;

