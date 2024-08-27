// routes/businessRoutes.js

const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');

// Register a business
router.post('/register', businessController.registerBusiness);

// Fetch all businesses
router.get('/', businessController.getAllBusinesses);

module.exports = router;
