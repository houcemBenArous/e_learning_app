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
  }]
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
