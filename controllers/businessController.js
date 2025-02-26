const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const upload = require('./../utils/upload'); 
exports.registerBusiness = async (req, res) => {
    try {
        const {
            businessName,
            businessEmail,
            categoryId,
            businessAddress,
            businessPhone,
            websiteUrl,
            latitude,
            longitude,
            openingTime,
            closingTime,
            businessLicenseNumber,
        } = req.body;

        // Upload images if provided
        let profilePictureUrl = null;
        let bannerUrl = null;

        if (req.files && req.files.profilePicture) {
            profilePictureUrl = req.files.profilePicture[0].path; // Assuming 'upload' middleware provides the file path
        }

        if (req.files && req.files.banner) {
            bannerUrl = req.files.banner[0].path; // Assuming 'upload' middleware provides the file path
        }

        // Convert latitude and longitude to Float
        const latitudeFloat = parseFloat(latitude);
        const longitudeFloat = parseFloat(longitude);

        // Convert businessLicenseNumber to Integer if it's provided
        const businessLicenseNumberInt = businessLicenseNumber ? parseInt(businessLicenseNumber, 10) : undefined;

        // Validate that the categoryId exists in the database
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
        });

        if (!category) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }

        // Validate that the user exists in the database
        const user = await prisma.user.findUnique({
            where: { email: businessEmail },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newBusiness = await prisma.business.create({
            data: {
                businessName,
                ownerId: user.id,
                categoryId,
                businessEmail,
                businessAddress,
                businessPhone,
                websiteUrl,
                latitude: latitudeFloat,
                longitude: longitudeFloat,
                openingTime,
                closingTime,
                businessLicenseNumber: businessLicenseNumberInt,
                profilePicture: profilePictureUrl, // Save profile picture URL
                banner: bannerUrl, // Save banner URL
            },
        });

        res.status(201).json(newBusiness);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllBusinesses = async (req, res) => {
    try {
        console.log('Attempting to fetch all businesses...');
        const businesses = await prisma.business.findMany({
            include: {
                category: true,
            },
        });

        console.log(`Successfully retrieved ${businesses.length} businesses`);
        res.status(200).json(businesses);
    } catch (error) {
        console.error('Database error in getAllBusinesses:', error);
        
        // Check for specific Prisma errors
        if (error.code === 'P1001') {
            console.error('Cannot reach database server');
            return res.status(500).json({ 
                error: 'Database connection failed. Please check your DATABASE_URL configuration.' 
            });
        } else if (error.code === 'P1003') {
            console.error('Database does not exist at the provided URL');
            return res.status(500).json({ 
                error: 'Database not found. Make sure your database exists and is properly migrated.' 
            });
        } else if (error.code === 'P2010' || error.code === 'P2011') {
            console.error('Raw query failed');
            return res.status(500).json({ 
                error: 'Database query failed. There might be an issue with your database schema.' 
            });
        }
        
        res.status(500).json({ 
            error: 'Internal server error when fetching businesses',
            details: error.message 
        });
    }
};

exports.getBusinessById = async (req, res) => {
    const { id } = req.params;

    try {
        const business = await prisma.business.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });

        if (!business) {
            return res.status(404).json({ message: 'Business not found' });
        }

        res.status(200).json(business);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCategoryById = async (req, res) => {
    const { categoryId } = req.params;

    try {
        if (!isValidUUID(categoryId)) {
            return res.status(400).json({ message: "Invalid category ID format" });
        }

        const category = await prisma.category.findUnique({
            where: { id: categoryId },
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBusinessesByCategoryId = async (req, res) => {
    const { categoryId } = req.params;

    try {
        if (!isValidUUID(categoryId)) {
            return res.status(400).json({ message: "Invalid category ID format" });
        }

        const categoryExists = await prisma.category.findUnique({
            where: { id: categoryId },
        });

        if (!categoryExists) {
            return res.status(404).json({ message: "Category not found" });
        }

        const businesses = await prisma.business.findMany({
            where: { categoryId },
            include: {
                category: true,
            },
        });

        if (businesses.length === 0) {
            return res.status(404).json({ message: "No businesses found for this category" });
        }

        res.status(200).json(businesses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBusinessesBySearchCriteria = async (req, res) => {
    const { name, address, service } = req.query;
    try {
        const searchConditions = {};

        if (name) {
            searchConditions.businessName = {
                contains: name,
                mode: 'insensitive'
            };
        }

        if (address) {
            searchConditions.businessAddress = {
                contains: address,
                mode: 'insensitive'
            };
        }

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

        const businesses = await prisma.business.findMany({
            where: searchConditions,
            include: {
                category: true,
                services: true,
            },
        });

        if (businesses.length === 0) {
            return res.status(404).json({ message: "No businesses found matching the search criteria" });
        }

        res.status(200).json(businesses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const isValidUUID = (id) => {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(id);
};

exports.deleteBusinessById = async (req, res) => {
    const { id } = req.params;

    try {
        const business = await prisma.business.findUnique({
            where: { id },
        });

        if (!business) {
            return res.status(404).json({ message: 'Business not found' });
        }

        await prisma.business.delete({
            where: { id },
        });

        res.status(200).json({ message: 'Business deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateBusinessById = async (req, res) => {
    const { id } = req.params;
    const {
        businessName,
        businessEmail,
        categoryId,
        businessAddress,
        businessPhone,
        websiteUrl,
        latitude,
        longitude,
        openingTime,
        closingTime,
        businessLicenseNumber,
    } = req.body;

    try {
        const latitudeFloat = latitude ? parseFloat(latitude) : undefined;
        const longitudeFloat = longitude ? parseFloat(longitude) : undefined;

        if (categoryId) {
            const category = await prisma.category.findUnique({
                where: { id: categoryId },
            });

            if (!category) {
                return res.status(400).json({ message: 'Invalid category ID' });
            }
        }

        const business = await prisma.business.findUnique({
            where: { id },
        });

        if (!business) {
            return res.status(404).json({ message: 'Business not found' });
        }

        // Upload images if provided
        let profilePictureUrl = business.profilePicture;
        let bannerUrl = business.banner;

        if (req.files && req.files.profilePicture) {
            profilePictureUrl = req.files.profilePicture[0].path; // Assuming 'upload' middleware provides the file path
        }

        if (req.files && req.files.banner) {
            bannerUrl = req.files.banner[0].path; // Assuming 'upload' middleware provides the file path
        }

        const updatedBusiness = await prisma.business.update({
            where: { id },
            data: {
                businessName,
                businessEmail,
                categoryId,
                businessAddress,
                businessPhone,
                websiteUrl,
                latitude: latitudeFloat,
                longitude: longitudeFloat,
                openingTime,
                closingTime,
                businessLicenseNumber: businessLicenseNumber ? parseInt(businessLicenseNumber, 10) : undefined,
                profilePicture: profilePictureUrl, // Update profile picture URL
                banner: bannerUrl, // Update banner URL
            },
        });

        res.status(200).json(updatedBusiness);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};