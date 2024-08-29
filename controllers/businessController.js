// controllers/businessController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Register a new business
 * This function allows a business owner to register their business by providing required details
 * including category selection from predefined categories.
 */
exports.registerBusiness = async (req, res) => {
    try {
        const {
            businessName,
            ownerId,
            categoryId, // The selected category ID
            businessEmail,
            businessAddress,
            businessPhone,
            websiteUrl,
            latitude,
            longitude
        } = req.body;

        // Create a new business with the provided data
        const newBusiness = await prisma.business.create({
            data: {
                businessName,
                ownerId,
                categoryId, // Associate business with selected category
                businessEmail,
                businessAddress,
                businessPhone,
                websiteUrl,
                latitude,
                longitude,
            },
        });

        // Respond with the newly created business details
        res.status(201).json(newBusiness);
    } catch (error) {
        // Handle errors and respond with appropriate message
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get all businesses
 * This function fetches all businesses along with their associated category details.
 */
exports.getAllBusinesses = async (req, res) => {
    try {
        // Fetch all businesses and include their associated category details
        const businesses = await prisma.business.findMany({
            include: {
                category: true, // Include category details
            },
        });

        

        // Respond with the list of businesses
        res.status(200).json(businesses);
    } catch (error) {
        // Handle errors and respond with appropriate message
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get a single business by ID
 * This function fetches details of a specific business identified by its ID, along with associated category details.
 */
exports.getBusinessById = async (req, res) => {
    const { id } = req.params;

    try {
        // Fetch the business by ID and include its associated category details
        const business = await prisma.business.findUnique({
            where: { id },
            include: {
                category: true, // Include category details
            },
        });

        // If the business is not found, respond with an appropriate message
        if (!business) {
            return res.status(404).json({ message: 'Business not found' });
        }

        // Respond with the business details
        res.status(200).json(business);
    } catch (error) {
        // Handle errors and respond with appropriate message
        res.status(500).json({ error: error.message });
    }
};
