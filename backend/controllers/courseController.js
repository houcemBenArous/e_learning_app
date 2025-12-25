const Course = require("../models/Course");
const User = require("../models/User");

exports.createCourse = async (req, res) => {
  const course = await Course.create({
    ...req.body,
    instructor: req.user.id
  });
  res.status(201).json(course);
};

exports.getCourses = async (req, res) => {
  const courses = await Course.find().populate("instructor", "name");
  res.json(courses);
};

exports.getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate("instructor students");
  res.json(course);
};


//enroll
exports.enrollCourse = async (req, res) => {
  const userId = req.user.id;
  const courseId = req.params.id;

  const course = await Course.findById(courseId);
  if (!course)
    return res.status(404).json({ message: "Course not found" });

  const user = await User.findById(userId);

  // éviter doublons
  if (course.students.includes(userId))
    return res.status(400).json({ message: "Already enrolled" });

  // update BOTH sides
  course.students.push(userId);
  user.coursesEnrolled.push(courseId);

  await course.save();
  await user.save();

  res.json({
    message: "Enrolled successfully",
    course: course.title
  });
};