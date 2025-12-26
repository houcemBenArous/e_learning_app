const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const {
  createQuiz,
  getQuizzesByCourse,
  updateQuiz,
  deleteQuiz
} = require("../controllers/quizController");

// Instructor only
router.post("/", auth, role("instructor"), createQuiz);
router.put("/:id", auth, role("instructor"), updateQuiz);
router.delete("/:id", auth, role("instructor"), deleteQuiz);

// Student + Instructor
router.get("/course/:courseId", auth, getQuizzesByCourse);

module.exports = router;
