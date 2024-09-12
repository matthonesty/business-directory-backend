const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create Rating
const createRating = async (req, res) => {
    try {
        const { userId } = req.user; // Get the logged-in user ID from the auth middleware
        const { businessId, rating } = req.body;

        // Validate input
        if (!businessId || rating === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate rating value (assuming a rating between 1 and 5)
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // Create new rating
        const newRating = await prisma.rating.create({
            data: {
                userId,
                businessId,
                rating,
            },
        });

        res.status(201).json(newRating);
    } catch (error) {
        console.error('Error creating rating:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update Rating
const updateRating = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;

        // Validate input
        if (rating === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate rating value (assuming a rating between 1 and 5)
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // Update rating
        const updatedRating = await prisma.rating.update({
            where: { id },
            data: { rating },
        });

        res.status(200).json(updatedRating);
    } catch (error) {
        console.error('Error updating rating:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete Rating
const deleteRating = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete the rating
        const deletedRating = await prisma.rating.delete({
            where: { id },
        });

        res.status(200).json(deletedRating);
    } catch (error) {
        console.error('Error deleting rating:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get Ratings by Business
const getRatingsByBusiness = async (req, res) => {
    try {
        const { businessId } = req.params;

        // Fetch ratings for the specific business
        const ratings = await prisma.rating.findMany({
            where: { businessId },
            include: { user: true }, // Include the user who gave the rating
        });

        res.status(200).json(ratings);
    } catch (error) {
        console.error('Error fetching ratings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    createRating,
    updateRating,
    deleteRating,
    getRatingsByBusiness,
};
