const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const initializeAdmin = require("./config/initAdmin");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const courseRoutes = require("./routes/courseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const quizRoutes = require("./routes/quizRoutes");
const adminRoutes = require("./routes/adminRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Connexion à la base de données et initialisation de l'admin
const startServer = async () => {
  await connectDB();
  await initializeAdmin(); // Créer l'admin si n'existe pas
};

startServer();

app.get("/", (req, res) => {
  res.send("API E-Learning running");
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/feedback", feedbackRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));