const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Inscription pour les étudiants uniquement
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "student" // Toujours student lors du signup
  });

  res.status(201).json({ message: "User created", user: { name: user.name, email: user.email, role: user.role } });
};

// Création d'instructeur par l'admin uniquement
exports.createInstructor = async (req, res) => {
  const { name, email, password } = req.body;

  // Vérifier que l'utilisateur connecté est un admin
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Accès refusé: seul l'admin peut créer des instructeurs" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "Un utilisateur avec cet email existe déjà" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const instructor = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "instructor"
  });

  res.status(201).json({ 
    message: "Instructeur créé avec succès", 
    instructor: { 
      id: instructor._id,
      name: instructor.name, 
      email: instructor.email, 
      role: instructor.role 
    } 
  });
};

// Login pour tous les rôles
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { 
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ 
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};