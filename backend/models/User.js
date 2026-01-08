const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "instructor", "admin"],
    default: "student"
  },
  coursesEnrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }],
  
  // Instructor-specific rating fields
  instructorRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalInstructorReviews: {
    type: Number,
    default: 0
  },
  instructorRatingDistribution: {
    5: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    1: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);