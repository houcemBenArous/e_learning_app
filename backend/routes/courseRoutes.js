const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createCourse,
  getCourses,
  getCourseById
} = require("../controllers/courseController");

router.post("/", auth, createCourse);
router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/:id/enroll", auth, enrollCourse);

module.exports = router;
