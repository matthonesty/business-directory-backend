const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
            longitude 
        } = req.body;

       
        const latitudeFloat = parseFloat(latitude);
        const longitudeFloat = parseFloat(longitude);

  
        const category = await prisma.category.findUnique({
            where: { id: categoryId }
        });

        if (!category) {
            return res.status(400).json({ message: "Invalid category ID" });
        }

      
        const user = await prisma.user.findUnique({
            where: { email: businessEmail }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
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
            },
        });

       
        res.status(201).json(newBusiness);
    } catch (error) {
      
        res.status(500).json({ error: error.message });
    }
};

exports.getAllBusinesses = async (req, res) => {
    try {
      
        const businesses = await prisma.business.findMany({
            include: {
                category: true, 
            },
        });

 
        res.status(200).json(businesses);
    } catch (error) {
  
        res.status(500).json({ error: error.message });
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

    console.log('Received categoryId:', categoryId); 

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
/// controllers/businessController.js

/**
 * Delete a business by ID
 * This function deletes a business identified by its ID.
 */
exports.deleteBusinessById = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the business exists
        const business = await prisma.business.findUnique({
            where: { id },
        });

        if (!business) {
            return res.status(404).json({ message: 'Business not found' });
        }

        // Delete the business
        await prisma.business.delete({
            where: { id },
        });

        // Respond with a success message
        res.status(200).json({ message: 'Business deleted successfully' });
    } catch (error) {
        // Handle errors and respond with an appropriate message
        res.status(500).json({ error: error.message });
    }
};

/**
 * Update a business by ID
 * This function updates the details of a business identified by its ID.
 */
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
    } = req.body;

    try {
        // Convert latitude and longitude to Float if provided
        const latitudeFloat = latitude ? parseFloat(latitude) : undefined;
        const longitudeFloat = longitude ? parseFloat(longitude) : undefined;

        // Validate the categoryId if provided
        if (categoryId) {
            const category = await prisma.category.findUnique({
                where: { id: categoryId }
            });

            if (!category) {
                return res.status(400).json({ message: "Invalid category ID" });
            }
        }

        // Check if the business exists
        const business = await prisma.business.findUnique({
            where: { id },
        });

        if (!business) {
            return res.status(404).json({ message: 'Business not found' });
        }

        // Update the business with the provided data
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
            },
        });

        // Respond with the updated business details
        res.status(200).json(updatedBusiness);
    } catch (error) {
        // Handle errors and respond with an appropriate message
        res.status(500).json({ error: error.message });
    }
};
