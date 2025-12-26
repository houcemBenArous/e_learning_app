const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollCourse
} = require("../controllers/courseController");

router.post("/", auth, role("instructor"), createCourse);
router.get("/", getCourses);
router.get("/:id", getCourseById);
router.put("/:id", auth, role("instructor"), updateCourse);
router.delete("/:id", auth, role("instructor"), deleteCourse);
router.post("/:id/enroll", auth, role("student"), enrollCourse);

module.exports = router;
