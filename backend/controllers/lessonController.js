const Lesson = require("../models/Lesson");
const Course = require("../models/Course");

// CREATE lesson
exports.createLesson = async (req, res) => {
  const { title, content, videoUrl, courseId } = req.body;

  const course = await Course.findById(courseId);
  if (!course)
    return res.status(404).json({ message: "Course not found" });

  const lesson = await Lesson.create({
    title,
    content,
    videoUrl,
    course: courseId
  });

  //lier au course
  course.lessons.push(lesson._id);
  await course.save();

  res.status(201).json(lesson);
};

// GET lessons by course
exports.getLessonsByCourse = async (req, res) => {
  const lessons = await Lesson.find({ course: req.params.courseId });
  res.json(lessons);
};

// UPDATE lesson
exports.updateLesson = async (req, res) => {
  const lesson = await Lesson.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(lesson);
};

// DELETE lesson
exports.deleteLesson = async (req, res) => {
  await Lesson.findByIdAndDelete(req.params.id);
  res.json({ message: "Lesson deleted" });
};
