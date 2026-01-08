const express = require("express");
const router = express.Router();
const { register, login, createInstructor } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// Route publique pour inscription des étudiants
router.post("/register", register);

// Route publique pour connexion
router.post("/login", login);

// Route protégée pour création d'instructeur (admin uniquement)
router.post("/create-instructor", auth, role("admin"), createInstructor);

module.exports = router;