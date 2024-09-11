// routes/commentsRoutes.js
const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');

// Route to create a comment
router.post('/', commentsController.createComment);

// Route to get comments by business ID
router.get('/businesses/:businessId/comments', commentsController.getCommentsByBusiness);

module.exports = router;
