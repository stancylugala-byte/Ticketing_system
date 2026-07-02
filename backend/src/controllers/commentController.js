const commentService = require('../services/commentService');

const addComment = async (req, res, next) => {
  try {
    const comment = await commentService.addComment({
      ticketId: req.params.id,
      userId: req.user.id,
      comment: req.body.comment,
      is_internal: req.body.is_internal || false
    });
    res.status(201).json({ success: true, data: comment });
  } catch (err) { next(err); }
};

const getComments = async (req, res, next) => {
  try {
    const includeInternal = req.user.role !== 'Client';
    const comments = await commentService.getComments(req.params.id, includeInternal);
    res.json({ success: true, data: comments });
  } catch (err) { next(err); }
};

module.exports = { addComment, getComments };
