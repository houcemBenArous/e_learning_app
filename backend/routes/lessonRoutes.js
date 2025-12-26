const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const {
  createLesson,
  getLessonsByCourse,
  updateLesson,
  deleteLesson
} = require("../controllers/lessonController");

// Instructor only
router.post("/", auth, role("instructor"), createLesson);
router.put("/:id", auth, role("instructor"), updateLesson);
router.delete("/:id", auth, role("instructor"), deleteLesson);

// Student + Instructor
router.get("/course/:courseId", auth, getLessonsByCourse);

module.exports = router;
