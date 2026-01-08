const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
  createFeedback,
  getCourseFeedback,
  getInstructorFeedback,
  updateFeedback,
  deleteFeedback,
  markFeedbackHelpful,
  getMyFeedback
} = require("../controllers/feedbackController");

// Student routes (authenticated)
router.post("/", auth, role("student"), createFeedback);
router.get("/my-feedback", auth, role("student"), getMyFeedback);
router.put("/:feedbackId", auth, role("student"), updateFeedback);
router.delete("/:feedbackId", auth, role("student"), deleteFeedback);

// Public routes (anyone can view feedback)
router.get("/course/:courseId", getCourseFeedback);
router.get("/instructor/:instructorId", getInstructorFeedback);

// Authenticated routes (any logged-in user can mark as helpful)
router.post("/:feedbackId/helpful", auth, markFeedbackHelpful);

module.exports = router;