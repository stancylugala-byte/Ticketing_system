const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // ✅ Log errors for debugging
    console.log('❌ Validation Errors:', JSON.stringify(errors.array(), null, 2));
    console.log('📦 Request Body:', req.body);

    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
        value: e.value || null
      }))
    });
  }
  next();
};

module.exports = validate;