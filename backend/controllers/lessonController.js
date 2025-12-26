const Lesson = require("../models/Lesson");
const Course = require("../models/Course");

// CREATE lesson
exports.createLesson = async (req, res) => {
  const { title, content, videoUrl, courseId } = req.body;

  const course = await Course.findById(courseId);
  if (!course)
    return res.status(404).json({ message: "Course not found" });

  // Verify ownership
  if (course.instructor.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "You are not allowed to add lessons to this course"
    });
  }

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
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson)
    return res.status(404).json({ message: "Lesson not found" });

  const course = await Course.findById(lesson.course);
  if (course.instructor.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "You are not allowed to update this lesson"
    });
  }

  const updatedLesson = await Lesson.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedLesson);
};

// DELETE lesson
exports.deleteLesson = async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson)
    return res.status(404).json({ message: "Lesson not found" });

  const course = await Course.findById(lesson.course);
  if (course.instructor.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "You are not allowed to delete this lesson"
    });
  }

  // Remove lesson from course
  await Course.findByIdAndUpdate(lesson.course, {
    $pull: { lessons: lesson._id }
  });

  await lesson.deleteOne();
  res.json({ message: "Lesson deleted" });
};
