const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Register a new business
 * This function allows a business owner to register their business by providing required details
 * including category selection from predefined categories.
 */exports.registerBusiness = async (req, res) => {
    try {
        const {
            businessName,
            businessEmail, // This will be used to find the user
            categoryId, // The selected category ID
            businessAddress,
            businessPhone,
            websiteUrl,
            latitude, // Make sure this is a Float
            longitude // Make sure this is a Float
        } = req.body;

        // Convert latitude and longitude to Float
        const latitudeFloat = parseFloat(latitude);
        const longitudeFloat = parseFloat(longitude);

        // Validate that the categoryId exists in the database
        const category = await prisma.category.findUnique({
            where: { id: categoryId }
        });

        if (!category) {
            return res.status(400).json({ message: "Invalid category ID" });
        }

        // Find the user by email to get the ownerId
        const user = await prisma.user.findUnique({
            where: { email: businessEmail }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create a new business with the provided data
        const newBusiness = await prisma.business.create({
            data: {
                businessName,
                ownerId: user.id, // Use the ID of the user
                categoryId, // Associate business with selected category
                businessEmail,
                businessAddress,
                businessPhone,
                websiteUrl,
                latitude: latitudeFloat, // Use Float values
                longitude: longitudeFloat, // Use Float values
            },
        });

        // Respond with the newly created business details
        res.status(201).json(newBusiness);
    } catch (error) {
        // Handle errors and respond with appropriate message
        res.status(500).json({ error: error.message });
    }
};

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


// controllers/businessController.js

/**
 * Get category details by ID
 * This function fetches the name of a category based on its ID.
 */
exports.getCategoryById = async (req, res) => {
    const { categoryId } = req.params;

    try {
        // Validate the category ID format
        if (!isValidUUID(categoryId)) {
            return res.status(400).json({ message: "Invalid category ID format" });
        }

        // Fetch the category by ID
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
        });

        // If the category is not found, respond with an appropriate message
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Respond with the category details
        res.status(200).json(category);
    } catch (error) {
        // Handle errors and respond with an appropriate message
        res.status(500).json({ error: error.message });
    }
};
exports.getBusinessesByCategoryId = async (req, res) => {
    const { categoryId } = req.params;

    console.log('Received categoryId:', categoryId); // Log the received ID

    try {
        // Ensure the categoryId is a valid UUID
        if (!isValidUUID(categoryId)) {
            return res.status(400).json({ message: "Invalid category ID format" });
        }

        // Check if the category exists
        const categoryExists = await prisma.category.findUnique({
            where: { id: categoryId },
        });

        if (!categoryExists) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Fetch all businesses that belong to the given categoryId
        const businesses = await prisma.business.findMany({
            where: { categoryId },
            include: {
                category: true, // Include category details if needed
            },
        });

        // If no businesses are found, respond with an appropriate message
        if (businesses.length === 0) {
            return res.status(404).json({ message: "No businesses found for this category" });
        }

        // Respond with the list of businesses
        res.status(200).json(businesses);
    } catch (error) {
        // Handle errors and respond with an appropriate message
        res.status(500).json({ error: error.message });
    }
};
// controllers/businessController.js



exports.getBusinessesBySearchCriteria = async (req, res) => {
    const { name, address, service } = req.query; // Use query parameters for more flexibility

    try {
        // Construct a dynamic search object
        const searchConditions = {};

        // Add condition for business name
        if (name) {
            searchConditions.businessName = {
                contains: name,
                mode: 'insensitive'
            };
        }

        // Add condition for business address
        if (address) {
            searchConditions.businessAddress = {
                contains: address,
                mode: 'insensitive'
            };
        }

        // Add condition for services (assuming services is a related model)
        if (service) {
            searchConditions.services = {
                some: {
                    serviceName: {
                        contains: service,
                        mode: 'insensitive'
                    }
                }
            };
        }

        // Fetch businesses that match the search conditions
        const businesses = await prisma.business.findMany({
            where: searchConditions,
            include: {
                category: true,  // Include category details if needed
                services: true,  // Include services details if needed
            },
        });

        // If no businesses are found, respond with an appropriate message
        if (businesses.length === 0) {
            return res.status(404).json({ message: "No businesses found matching the search criteria" });
        }

        // Respond with the list of businesses
        res.status(200).json(businesses);
    } catch (error) {
        // Handle errors and respond with an appropriate message
        res.status(500).json({ error: error.message });
    }
};



const isValidUUID = (id) => {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(id);
};