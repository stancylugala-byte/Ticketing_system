const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * protect — verifies JWT token from Authorization header and attaches user to req
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // ✅ FIX: Use 'userId' from the token (matches your authController)
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account no longer exists.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};

/**
 * requireRole(...roles) — role guard factory
 * Usage: router.get('/admin-only', protect, requireRole('Admin'), handler)
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated.'
    });
  }

  // ✅ FIX: Use 'account_type' (matches your User model)
  const userRole = req.user.account_type;
  if (!roles.includes(userRole)) {
    return res.status(403).json({
      success: false,
      message: `Access denied. This resource requires role: ${roles.join(' or ')}.`
    });
  }
  next();
};

module.exports = { protect, requireRole };