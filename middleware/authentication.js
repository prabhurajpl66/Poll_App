import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  console.log("verified token...",token)
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

