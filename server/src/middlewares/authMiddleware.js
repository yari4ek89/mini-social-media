// Import neccessary library
import jwt from "jsonwebtoken"; // import jwt from jsonwebtoken

// Export protect arrrow function
export const protect = (req, res, next) => {
  const token = req.cookies?.token; // try to get from cookie session token

  // If no session token -> error
  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  // Try to verify session token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // compare session token with JWT token
    req.user = decoded; // assign to user decoded
    next(); // next middleware
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
