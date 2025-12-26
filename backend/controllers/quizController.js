const Quiz = require("../models/Quiz");
const Course = require("../models/Course");

// CREATE quiz
exports.createQuiz = async (req, res) => {
  const { title, questions, courseId } = req.body;

  const course = await Course.findById(courseId);
  if (!course)
    return res.status(404).json({ message: "Course not found" });

  // ownership check
  if (course.instructor.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "Not allowed to add quiz to this course"
    });
  }

  const quiz = await Quiz.create({
    title,
    questions,
    course: courseId
  });

  course.quizzes.push(quiz._id);
  await course.save();

  res.status(201).json(quiz);
};

// GET quizzes by course
exports.getQuizzesByCourse = async (req, res) => {
  const quizzes = await Quiz.find({ course: req.params.courseId });
  res.json(quizzes);
};

// UPDATE quiz
exports.updateQuiz = async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz)
    return res.status(404).json({ message: "Quiz not found" });

  const course = await Course.findById(quiz.course);
  if (course.instructor.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "Not allowed to update this quiz"
    });
  }

  const updatedQuiz = await Quiz.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedQuiz);
};

// DELETE quiz
exports.deleteQuiz = async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz)
    return res.status(404).json({ message: "Quiz not found" });

  const course = await Course.findById(quiz.course);
  if (course.instructor.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "Not allowed to delete this quiz"
    });
  }

  await Course.findByIdAndUpdate(
    quiz.course,
    { $pull: { quizzes: quiz._id } }
  );

  await quiz.deleteOne();

  res.json({ message: "Quiz deleted successfully" });
};
