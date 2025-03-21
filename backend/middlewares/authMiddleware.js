const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables from a .env file
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET; // Use environment variable for secret

module.exports = function(req, res, next) {
  // Extract token from Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // If token is missing, return an unauthorized response
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    // Verify token using JWT secret
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.id; // Add user ID (or other relevant data) to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Authentication error:', err.message);
    // Return a generic error message to avoid exposing sensitive information
    res.status(401).json({ message: 'Token is not valid' });
  }
};
