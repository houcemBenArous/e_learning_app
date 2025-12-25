const Course = require("../models/Course");

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
