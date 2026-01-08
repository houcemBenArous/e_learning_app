const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
  getStatistics,
  getAllInstructors,
  getAllStudents,
  getAllCourses,
  deleteInstructor,
  getDashboard
} = require("../controllers/adminController");

// Toutes les routes sont protégées et accessibles uniquement par l'admin
router.use(auth, role("admin"));

// Dashboard complet
router.get("/dashboard", getDashboard);

// Statistiques globales
router.get("/statistics", getStatistics);

// Gestion des instructeurs
router.get("/instructors", getAllInstructors);
router.delete("/instructors/:id", deleteInstructor);

// Liste des étudiants
router.get("/students", getAllStudents);

// Liste des cours
router.get("/courses", getAllCourses);

module.exports = router;