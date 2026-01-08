const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson"
  }],
  quizzes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz"
  }],
  
  // Rating aggregates
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  ratingDistribution: {
    5: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    1: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
