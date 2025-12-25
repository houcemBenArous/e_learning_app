const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createOrUpdateProfile,
  getMyProfile
} = require("../controllers/profileController");

router.post("/", auth, createOrUpdateProfile);
router.get("/me", auth, getMyProfile);

module.exports = router;
