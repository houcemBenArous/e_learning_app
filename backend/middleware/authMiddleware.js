const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Utiliser directement les données du token (id, email, role)
    req.user = {
      _id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};