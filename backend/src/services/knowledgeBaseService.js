const { Op } = require('sequelize');
const db = require('../models');
const { KnowledgeBase, User } = db;

const searchArticles = async (query) => {
  return KnowledgeBase.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.like]: `%${query}%` } },
        { content: { [Op.like]: `%${query}%` } }
      ]
    },
    include: [{ model: User, as: 'author', attributes: ['id', 'full_name'] }],
    order: [['created_at', 'DESC']],
    limit: 20
  });
};

const getAllArticles = async () => {
  return KnowledgeBase.findAll({
    include: [{ model: User, as: 'author', attributes: ['id', 'full_name'] }],
    order: [['created_at', 'DESC']]
  });
};

const getArticleById = async (id) => {
  const article = await KnowledgeBase.findByPk(id, {
    include: [{ model: User, as: 'author', attributes: ['id', 'full_name'] }]
  });
  if (!article) { const e = new Error('Article not found'); e.status = 404; throw e; }
  return article;
};

const createArticle = async ({ title, content, userId }) => {
  const article = await KnowledgeBase.create({ title, content, user_id: userId });
  return getArticleById(article.article_id);
};

module.exports = { searchArticles, getAllArticles, getArticleById, createArticle };
