const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to access :id from parent
const commentController = require('../controllers/commentController');
const { addCommentRules } = require('../validators/commentValidators');
const validate = require('../middleware/validate');
const mockAuth = require('../middleware/mockAuth');

router.use(mockAuth);

router.get('/', commentController.getComments);
router.post('/', addCommentRules, validate, commentController.addComment);

module.exports = router;
