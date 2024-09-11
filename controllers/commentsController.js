// controllers/commentsController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createComment = async (req, res) => {
  try {
    const { username, businessId, comment } = req.body;

    // Validate input
    if (!username || !businessId || !comment) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find the user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new comment
    const newComment = await prisma.comment.create({
      data: {
        userId: user.id,
        businessId,
        comment,
      },
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getCommentsByBusiness = async (req, res) => {
  try {
    const { businessId } = req.params;

    // Validate businessId
    if (!businessId) {
      return res.status(400).json({ error: 'Missing businessId' });
    }

    // Get comments for the specific business
    const comments = await prisma.comment.findMany({
      where: { businessId },
      include: { user: true },
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createComment,
  getCommentsByBusiness,
};
