const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const authMiddleware = require('../middleware/authMiddleware');
const prisma = require('../prisma/client');

// Test endpoint to check database connectivity
router.get('/test-db', async (req, res) => {
  try {
    // Attempt to count categories (simple query)
    const categoryCount = await prisma.category.count();
    return res.status(200).json({ 
      message: 'Database connection successful', 
      categoryCount: categoryCount,
      databaseUrl: process.env.DATABASE_URL ? 'Configured (value hidden)' : 'Missing' 
    });
  } catch (error) {
    console.error('Database test failed:', error);
    return res.status(500).json({ 
      error: 'Database connection failed', 
      errorCode: error.code,
      errorType: error.constructor.name,
      message: error.message
    });
  }
});

// Route to register a new business
router.post('/register', businessController.registerBusiness);

// Route to get all businesses
router.get('/', businessController.getAllBusinesses);

// Route to get a specific business by ID
router.get('/:id', businessController.getBusinessById);
router.get('/businesses/category/:categoryId', businessController.getBusinessesByCategoryId);
router.get('/categories/:categoryId', businessController.getCategoryById);
// router.get('/businesses/name/:name', businessController.getBusinessesByName);
router.get('/businesses/search', businessController.getBusinessesBySearchCriteria);
router.put("/business/:id", authMiddleware, businessController.updateBusinessById);
router.delete('/business/:id', authMiddleware, businessController.deleteBusinessById);

module.exports = router;