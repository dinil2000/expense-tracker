// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
  try {
    // Extract token from Authorization header (Bearer Token) or x-auth-token
    const token = req.header('Authorization')?.split(' ')[1] || req.header('x-auth-token');

    // If no token is found, return a 401 response
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify the token
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ message: 'Server configuration error. Please contact support.' });
    }

    const decoded = jwt.verify(token, secretKey);

    // Attach decoded payload (e.g., userId) to the request object for downstream use
    req.user = decoded;

    // Call the next middleware or route handler
    next();
  } catch (err) {
    console.error('Token verification error:', err.message); // Log the error for debugging
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
