const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../models');

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

const safeUser = (user) => ({
  id: user.id,
  full_name: user.full_name,
  email: user.email,
  role: user.role
});

// ── Register ──────────────────────────────────────────────────────────────────
const register = async ({ full_name, email, password, role = 'Client' }) => {
  const existing = await db.User.findOne({ where: { email } });
  if (existing) {
    const err = new Error('An account with this email already exists.');
    err.status = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await db.User.create({ full_name, email, password: hashedPassword, role });

  return { token: generateToken(user), user: safeUser(user) };
};

// ── Login ─────────────────────────────────────────────────────────────────────
const login = async ({ email, password }) => {
  const user = await db.User.findOne({ where: { email } });
  if (!user) {
    const err = new Error('Invalid email or password.'); err.status = 401; throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error('Invalid email or password.'); err.status = 401; throw err;
  }

  return { token: generateToken(user), user: safeUser(user) };
};

// ── Forgot Password ───────────────────────────────────────────────────────────
const forgotPassword = async (email) => {
  const user = await db.User.findOne({ where: { email } });

  // Always return success — prevents email enumeration
  if (!user) {
    return { message: 'If that email exists, a reset link has been sent.' };
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await user.update({ reset_token: token, reset_token_expires: expires });

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

  // In production: send email with resetUrl
  // For development: return token directly so frontend can redirect
  return {
    message: 'Password reset link has been generated.',
    reset_token: token,   // dev only — remove in production
    reset_url: resetUrl   // dev only — remove in production
  };
};

// ── Reset Password ────────────────────────────────────────────────────────────
const resetPassword = async ({ token, password }) => {
  const user = await db.User.findOne({ where: { reset_token: token } });

  if (!user || !user.reset_token_expires || new Date() > new Date(user.reset_token_expires)) {
    const err = new Error('This reset link is invalid or has expired. Please request a new one.');
    err.status = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await user.update({ password: hashedPassword, reset_token: null, reset_token_expires: null });

  return { message: 'Password has been reset successfully. You can now log in.' };
};

// ── Get current user ──────────────────────────────────────────────────────────
const getMe = async (userId) => {
  const user = await db.User.findByPk(userId, {
    attributes: ['id', 'full_name', 'email', 'role', 'created_at']
  });
  if (!user) { const e = new Error('User not found'); e.status = 404; throw e; }
  return user;
};

// ── Update profile ─────────────────────────────────────────────────────────────
const updateProfile = async (userId, { full_name, current_password, new_password }) => {
  const user = await db.User.findByPk(userId);
  if (!user) { const e = new Error('User not found'); e.status = 404; throw e; }

  const updates = {};
  if (full_name && full_name.trim()) updates.full_name = full_name.trim();

  if (new_password) {
    if (!current_password) {
      const e = new Error('Current password is required to set a new password.');
      e.status = 400; throw e;
    }
    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      const e = new Error('Current password is incorrect.');
      e.status = 401; throw e;
    }
    updates.password = await bcrypt.hash(new_password, 12);
  }

  await user.update(updates);
  return { id: user.id, full_name: user.full_name, email: user.email, role: user.role };
};

module.exports = { register, login, forgotPassword, resetPassword, getMe, updateProfile };
