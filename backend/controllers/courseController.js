const Course = require("../models/Course");
const User = require("../models/User");

exports.createCourse = async (req, res) => {
  const course = await Course.create({
    ...req.body,
    instructor: req.user._id
  });
  res.status(201).json(course);
};


//get all courses
exports.getCourses = async (req, res) => {
  const courses = await Course.find()
    .populate("instructor", "name instructorRating totalInstructorReviews")
    .select("title description instructor averageRating totalReviews createdAt");
  res.json(courses);
};




exports.getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate("instructor", "name email instructorRating totalInstructorReviews")
    .populate("students", "name email");
  
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }
  
  res.json(course);
};

//update
exports.updateCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course)
    return res.status(404).json({ message: "Course not found" });

  // vérifier que l'instructor est le propriétaire
  if (course.instructor.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "You are not allowed to update this course"
    });
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedCourse);
};



//delete
exports.deleteCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course)
    return res.status(404).json({ message: "Course not found" });

  // vérifier ownership
  if (course.instructor.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "You are not allowed to delete this course"
    });
  }

  // retirer le cours des users inscrits
  await User.updateMany(
    { coursesEnrolled: course._id },
    { $pull: { coursesEnrolled: course._id } }
  );

  await course.deleteOne();

  res.json({ message: "Course deleted successfully" });
};








//enroll
exports.enrollCourse = async (req, res) => {
  const userId = req.user._id;
  const courseId = req.params.id;

  const course = await Course.findById(courseId);
  if (!course)
    return res.status(404).json({ message: "Course not found" });

  const user = await User.findById(userId);

  // éviter doublons
  if (course.students.map(id => id.toString()).includes(userId.toString()))
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