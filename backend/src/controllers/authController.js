const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { sequelize } = require('../config/sequelize');
const { DataTypes } = require('sequelize');

// ✅ Define User model to match your database columns
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    full_name: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    account_type: {
        type: DataTypes.ENUM('individual', 'company', 'Client', 'SupportOfficer', 'Developer', 'Admin'),
        defaultValue: 'individual'
    },
    reset_token: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    reset_token_expires: {
        type: DataTypes.DATE,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
                console.log('🔐 Password hashed during creation');
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
                console.log('🔐 Password hashed during update');
            }
        }
    }
});

// ✅ Add instance method for password comparison
User.prototype.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
    try {
        console.log('📦 Request body:', req.body);

        const name = req.body.full_name?.trim() || req.body.name?.trim();

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Full name is required'
            });
        }

        const email = req.body.email;
        const password = req.body.password;
        const phone = req.body.phone || '';

        // ✅ Map role to account_type - now accepts all roles
        let account_type = req.body.account_type || req.body.role || 'individual';

        console.log('📝 Account type being saved:', account_type);

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // ✅ Create user
        const user = await User.create({
            name: name,
            full_name: name,
            email,
            password,
            phone,
            account_type: account_type
        });

        console.log('✅ User created with ID:', user.id);

        const token = generateToken(user.id);

        const userData = user.toJSON();
        delete userData.password;

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: userData
        });
    } catch (error) {
        console.error('Registration error:', error);

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: error.errors[0].message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('🔐 Login attempt for:', email);

        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log('❌ User not found:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        console.log('✅ User found:', user.email);

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            console.log('❌ Password mismatch for:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        console.log('✅ Password match for:', email);

        const token = generateToken(user.id);

        const userData = user.toJSON();
        delete userData.password;

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: userData
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password', 'reset_token', 'reset_token_expires'] }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email'
            });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 3600000);

        user.reset_token = resetToken;
        user.reset_token_expires = resetTokenExpires;
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
        console.log('🔐 Reset URL:', resetUrl);

        res.json({
            success: true,
            message: 'Password reset link sent to your email'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        const user = await User.findOne({
            where: {
                reset_token: token,
                reset_token_expires: {
                    [Op.gt]: new Date()
                }
            }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        user.password = password;
        user.reset_token = null;
        user.reset_token_expires = null;
        await user.save();

        res.json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

