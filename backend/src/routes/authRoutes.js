const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate  = require('../middleware/validate');
const {
  registerRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules
} = require('../validators/authValidators');

// ─── Standard auth ────────────────────────────────────────────────────────────
router.post('/register',        registerRules,       validate, register);
router.post('/login',           loginRules,          validate, login);
router.post('/forgot-password', forgotPasswordRules, validate, forgotPassword);
router.post('/reset-password',  resetPasswordRules,  validate, resetPassword);

router.get('/me',        protect, getMe);
router.patch('/profile', protect, updateProfile);

// ─── Google OAuth ─────────────────────────────────────────────────────────────
// Step 1: redirect to Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Step 2: Google redirects back here
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed` }),
  (req, res) => {
    // Issue JWT exactly like standard login
    const user  = req.user;
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const ROLE_PATHS = {
      Client:         '/dashboard/client',
      SupportOfficer: '/dashboard/support',
      Developer:      '/dashboard/dev',
      Manager:        '/dashboard/manager',
      Admin:          '/dashboard/admin',
    };
    const dest = ROLE_PATHS[user.role] || '/dashboard/client';

    // Pass token + user via URL fragment so the frontend can grab it without a separate API call
    const encoded = encodeURIComponent(JSON.stringify({
      token,
      user: {
        id:        user.id,
        full_name: user.full_name,
        email:     user.email,
        role:      user.role,
      }
    }));

    res.redirect(`${process.env.CLIENT_URL}/auth/callback#data=${encoded}`);
  }
);

module.exports = router;
