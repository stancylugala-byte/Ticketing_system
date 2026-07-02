const express = require('express');
const router = express.Router();
const kbController = require('../controllers/knowledgeBaseController');
const { searchKbRules, createArticleRules } = require('../validators/knowledgeBaseValidators');
const validate = require('../middleware/validate');
const mockAuth = require('../middleware/mockAuth');

router.use(mockAuth);

router.get('/search', searchKbRules, validate, kbController.searchArticles);
router.get('/', kbController.getAllArticles);
router.get('/:id', kbController.getArticleById);
router.post('/', createArticleRules, validate, kbController.createArticle);

module.exports = router;
