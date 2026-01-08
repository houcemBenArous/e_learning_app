const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
  // Course feedback
  courseRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  courseReview: {
    type: String,
    maxlength: 1000,
    trim: true
  },
  
  // Instructor feedback
  instructorRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  instructorReview: {
    type: String,
    maxlength: 1000,
    trim: true
  },
  
  // Metadata
  isVerifiedEnrollment: {
    type: Boolean,
    default: true
  },
  helpfulVotes: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Compound index to ensure one feedback per student per course
feedbackSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Feedback", feedbackSchema);