// routes/businessRoutes.js

const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');

// Route to register a new business
router.post('/register', businessController.registerBusiness);

// Route to get all businesses
router.get('/', businessController.getAllBusinesses);

// Route to get a specific business by ID
router.get('/:id', businessController.getBusinessById);

// Search businesses by category
router.get('/search', businessController.searchBusinessesByCategory);

module.exports = router;
