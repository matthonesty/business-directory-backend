// controllers/businessController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Register a new business
exports.registerBusiness = async (req, res) => {
    try {
        const { businessName, ownerId, categoryId, businessEmail, businessAddress, businessPhone, websiteUrl, latitude, longitude } = req.body;

        const newBusiness = await prisma.business.create({
            data: {
                businessName,
                ownerId,
                categoryId,
                businessEmail,
                businessAddress,
                businessPhone,
                websiteUrl,
                latitude,
                longitude
            }
        });

        res.status(201).json(newBusiness);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch all businesses
exports.getAllBusinesses = async (req, res) => {
    try {
        const businesses = await prisma.business.findMany();
        res.status(200).json(businesses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
