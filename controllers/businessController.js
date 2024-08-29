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


         // Validate that the categoryId exists in the database
         const category = await prisma.category.findUnique({
            where: { id: categoryId }