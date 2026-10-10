const express = require("express");

const router = express.Router();

const { protected: protect } = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

router.get(
  "/employee-view",
  protect,
  authorize("employee.view"),
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "You have employee.view permission",
    });
  }
);

router.get(
  "/employee-create",
  protect,
  authorize("employee.create"),
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "You have employee.create permission",
    });
  }
);

router.get(
  "/role-manage",
  protect,
  authorize("role.manage"),
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "You have role.manage permission",
    });
  }
);

module.exports = router;