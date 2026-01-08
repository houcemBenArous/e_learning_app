const User = require("../models/User");
const Course = require("../models/Course");

// Obtenir les statistiques de la plateforme
exports.getStatistics = async (req, res) => {
  try {
    const totalInstructors = await User.countDocuments({ role: "instructor" });
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalCourses = await Course.countDocuments();

    res.json({
      statistics: {
        totalInstructors,
        totalStudents,
        totalCourses
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des statistiques", error: error.message });
  }
};

// Obtenir tous les instructeurs
exports.getAllInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: "instructor" })
      .select("-password") // Exclure le mot de passe
      .sort({ createdAt: -1 }); // Les plus récents en premier

    // Enrichir avec le nombre de cours par instructeur
    const instructorsWithStats = await Promise.all(
      instructors.map(async (instructor) => {
        const coursesCount = await Course.countDocuments({ instructor: instructor._id });
        return {
          _id: instructor._id,
          name: instructor.name,
          email: instructor.email,
          role: instructor.role,
          createdAt: instructor.createdAt,
          coursesCount
        };
      })
    );

    res.json({
      total: instructorsWithStats.length,
      instructors: instructorsWithStats
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des instructeurs", error: error.message });
  }
};

// Obtenir tous les étudiants
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password")
      .sort({ createdAt: -1 });

    // Enrichir avec le nombre de cours inscrits
    const studentsWithStats = students.map(student => ({
      _id: student._id,
      name: student.name,
      email: student.email,
      role: student.role,
      createdAt: student.createdAt,
      enrolledCoursesCount: student.coursesEnrolled.length
    }));

    res.json({
      total: studentsWithStats.length,
      students: studentsWithStats
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des étudiants", error: error.message });
  }
};

// Obtenir tous les cours avec détails
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    const coursesWithStats = courses.map(course => ({
      _id: course._id,
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      studentsCount: course.students.length,
      lessonsCount: course.lessons.length,
      quizzesCount: course.quizzes.length,
      createdAt: course.createdAt
    }));

    res.json({
      total: coursesWithStats.length,
      courses: coursesWithStats
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des cours", error: error.message });
  }
};

// Supprimer un instructeur (et ses cours associés)
exports.deleteInstructor = async (req, res) => {
  try {
    const instructorId = req.params.id;

    const instructor = await User.findById(instructorId);
    if (!instructor || instructor.role !== "instructor") {
      return res.status(404).json({ message: "Instructeur non trouvé" });
    }

    // Supprimer tous les cours de cet instructeur
    await Course.deleteMany({ instructor: instructorId });

    // Supprimer l'instructeur
    await instructor.deleteOne();

    res.json({ message: "Instructeur et ses cours supprimés avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'instructeur", error: error.message });
  }
};

// Obtenir le dashboard complet
exports.getDashboard = async (req, res) => {
  try {
    const totalInstructors = await User.countDocuments({ role: "instructor" });
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalCourses = await Course.countDocuments();

    // Cours récents
    const recentCourses = await Course.find()
      .populate("instructor", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    // Instructeurs récents
    const recentInstructors = await User.find({ role: "instructor" })
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      statistics: {
        totalInstructors,
        totalStudents,
        totalCourses
      },
      recentCourses,
      recentInstructors
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du dashboard", error: error.message });
  }
};