const express = require("express");
const {
  getProfile,
  updateProfile,
  deleteProfile,
  changePassword,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.delete("/profile", authMiddleware, deleteProfile);
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;
