const Feedback = require("../models/Feedback");
const Course = require("../models/Course");
const User = require("../models/User");

// Helper function to update course rating aggregates
const updateCourseRatings = async (courseId) => {
  const feedbacks = await Feedback.find({ course: courseId });
  
  if (feedbacks.length === 0) {
    await Course.findByIdAndUpdate(courseId, {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    });
    return;
  }

  const totalReviews = feedbacks.length;
  const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.courseRating, 0);
  const averageRating = totalRating / totalReviews;

  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  feedbacks.forEach(feedback => {
    ratingDistribution[feedback.courseRating]++;
  });

  await Course.findByIdAndUpdate(courseId, {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    totalReviews,
    ratingDistribution
  });
};

// Helper function to update instructor rating aggregates
const updateInstructorRatings = async (instructorId) => {
  const feedbacks = await Feedback.find({ instructor: instructorId });
  
  if (feedbacks.length === 0) {
    await User.findByIdAndUpdate(instructorId, {
      instructorRating: 0,
      totalInstructorReviews: 0,
      instructorRatingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    });
    return;
  }

  const totalReviews = feedbacks.length;
  const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.instructorRating, 0);
  const averageRating = totalRating / totalReviews;

  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  feedbacks.forEach(feedback => {
    ratingDistribution[feedback.instructorRating]++;
  });

  await User.findByIdAndUpdate(instructorId, {
    instructorRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    totalInstructorReviews: totalReviews,
    instructorRatingDistribution: ratingDistribution
  });
};

// Create feedback
exports.createFeedback = async (req, res) => {
  try {
    const { courseId, courseRating, courseReview, instructorRating, instructorReview } = req.body;
    const studentId = req.user._id;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Verify student is enrolled in the course
    if (!course.students.includes(studentId)) {
      return res.status(403).json({ 
        message: "You must be enrolled in this course to leave feedback" 
      });
    }

    // Check if feedback already exists
    const existingFeedback = await Feedback.findOne({ 
      student: studentId, 
      course: courseId 
    });

    if (existingFeedback) {
      return res.status(400).json({ 
        message: "You have already provided feedback for this course" 
      });
    }

    // Create feedback
    const feedback = await Feedback.create({
      student: studentId,
      course: courseId,
      instructor: course.instructor,
      courseRating,
      courseReview,
      instructorRating,
      instructorReview
    });

    // Update aggregates
    await updateCourseRatings(courseId);
    await updateInstructorRatings(course.instructor);

    const populatedFeedback = await Feedback.findById(feedback._id)
      .populate("student", "name")
      .populate("course", "title")
      .populate("instructor", "name");

    res.status(201).json({
      message: "Feedback created successfully",
      feedback: populatedFeedback
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "You have already provided feedback for this course" 
      });
    }
    res.status(500).json({ 
      message: "Error creating feedback", 
      error: error.message 
    });
  }
};

// Get feedback for a course
exports.getCourseFeedback = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = req.query;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const feedbacks = await Feedback.find({ course: courseId })
      .populate("student", "name")
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Feedback.countDocuments({ course: courseId });

    res.json({
      feedbacks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      courseInfo: {
        title: course.title,
        averageRating: course.averageRating,
        totalReviews: course.totalReviews,
        ratingDistribution: course.ratingDistribution
      }
    });

  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching course feedback", 
      error: error.message 
    });
  }
};

// Get feedback for an instructor
exports.getInstructorFeedback = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const { page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = req.query;

    const instructor = await User.findById(instructorId);
    if (!instructor || instructor.role !== "instructor") {
      return res.status(404).json({ message: "Instructor not found" });
    }

    const feedbacks = await Feedback.find({ instructor: instructorId })
      .populate("student", "name")
      .populate("course", "title")
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Feedback.countDocuments({ instructor: instructorId });

    res.json({
      feedbacks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      instructorInfo: {
        name: instructor.name,
        instructorRating: instructor.instructorRating,
        totalInstructorReviews: instructor.totalInstructorReviews,
        instructorRatingDistribution: instructor.instructorRatingDistribution
      }
    });

  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching instructor feedback", 
      error: error.message 
    });
  }
};

// Update feedback (student can edit their own feedback)
exports.updateFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { courseRating, courseReview, instructorRating, instructorReview } = req.body;
    const studentId = req.user._id;

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Verify ownership
    if (feedback.student.toString() !== studentId.toString()) {
      return res.status(403).json({ 
        message: "You can only update your own feedback" 
      });
    }

    // Check if feedback is within edit window (30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    if (feedback.createdAt < thirtyDaysAgo) {
      return res.status(403).json({ 
        message: "Feedback can only be edited within 30 days of creation" 
      });
    }

    // Update feedback
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      {
        courseRating,
        courseReview,
        instructorRating,
        instructorReview
      },
      { new: true }
    ).populate("student", "name")
     .populate("course", "title")
     .populate("instructor", "name");

    // Update aggregates
    await updateCourseRatings(feedback.course);
    await updateInstructorRatings(feedback.instructor);

    res.json({
      message: "Feedback updated successfully",
      feedback: updatedFeedback
    });

  } catch (error) {
    res.status(500).json({ 
      message: "Error updating feedback", 
      error: error.message 
    });
  }
};

// Delete feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const studentId = req.user._id;

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Verify ownership
    if (feedback.student.toString() !== studentId.toString()) {
      return res.status(403).json({ 
        message: "You can only delete your own feedback" 
      });
    }

    const courseId = feedback.course;
    const instructorId = feedback.instructor;

    await Feedback.findByIdAndDelete(feedbackId);

    // Update aggregates
    await updateCourseRatings(courseId);
    await updateInstructorRatings(instructorId);

    res.json({ message: "Feedback deleted successfully" });

  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting feedback", 
      error: error.message 
    });
  }
};

// Mark feedback as helpful
exports.markFeedbackHelpful = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    const feedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { $inc: { helpfulVotes: 1 } },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.json({ 
      message: "Feedback marked as helpful",
      helpfulVotes: feedback.helpfulVotes
    });

  } catch (error) {
    res.status(500).json({ 
      message: "Error marking feedback as helpful", 
      error: error.message 
    });
  }
};

// Get my feedback (student's own feedback)
exports.getMyFeedback = async (req, res) => {
  try {
    const studentId = req.user._id;

    const feedbacks = await Feedback.find({ student: studentId })
      .populate("course", "title")
      .populate("instructor", "name")
      .sort({ createdAt: -1 });

    res.json({ feedbacks });

  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching your feedback", 
      error: error.message 
    });
  }
};