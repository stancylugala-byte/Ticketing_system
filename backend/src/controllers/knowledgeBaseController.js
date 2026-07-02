const kbService = require('../services/knowledgeBaseService');

const searchArticles = async (req, res, next) => {
  try {
    const articles = await kbService.searchArticles(req.query.q);
    res.json({ success: true, data: articles });
  } catch (err) { next(err); }
};

const getAllArticles = async (req, res, next) => {
  try {
    const articles = await kbService.getAllArticles();
    res.json({ success: true, data: articles });
  } catch (err) { next(err); }
};

const getArticleById = async (req, res, next) => {
  try {
    const article = await kbService.getArticleById(req.params.id);
    res.json({ success: true, data: article });
  } catch (err) { next(err); }
};

const createArticle = async (req, res, next) => {
  try {
    const article = await kbService.createArticle({
      title: req.body.title,
      content: req.body.content,
      userId: req.user.id
    });
    res.status(201).json({ success: true, data: article });
  } catch (err) { next(err); }
};

module.exports = { searchArticles, getAllArticles, getArticleById, createArticle };
