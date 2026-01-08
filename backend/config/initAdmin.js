const User = require("../models/User");
const bcrypt = require("bcryptjs");

const initializeAdmin = async () => {
  try {
    // Vérifier si un admin existe déjà
    const adminExists = await User.findOne({ role: "admin" });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      
      await User.create({
        name: "Administrator",
        email: "admin@elearning.com",
        password: hashedPassword,
        role: "admin"
      });
      
      console.log("✅ Admin créé avec succès:");
      console.log("   Email: admin@elearning.com");
      console.log("   Mot de passe: admin123");
      console.log("   ⚠️  Changez le mot de passe après la première connexion!");
    } else {
      console.log("ℹ️  Admin existe déjà");
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation de l'admin:", error);
  }
};

module.exports = initializeAdmin;