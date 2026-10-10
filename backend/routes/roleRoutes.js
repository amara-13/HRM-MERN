const express = require("express");
const router = express.Router();
const {protected} = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const {getRoles, getRole,createRole,updateRole,deleteRole} = require("../controllers/roleController");
 
router.get("/",protected,authorize("role.manage"),getRoles);
router.get("/:id",protected,authorize("role.manage"),getRole);
router.post("/create",protected,authorize("role.manage"),createRole);
router.patch("/:id",protected,authorize("role.manage"),updateRole);
router.delete("/:id",protected,authorize("role.manage"),deleteRole);


module.exports = router;
