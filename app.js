const express = require("express");
const app = express();
const cors = require('cors');
const businessRoutes=require("./routes/businessRoutes")
const userRoutes = require("./routes/userRoutes");
const fs = require('fs');
const path = require('path');

// CORS Configuration
const corsOptions = {
  origin: [
    'https://business-directory-frontend-chi.vercel.app', 
    'http://localhost:3000'  // For local development
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));


app.use('/uploads', express.static('uploads'));

// Middleware
app.use(express.json());

// Use routes
app.use("/api/users", userRoutes);
app.use('/api/businesses', businessRoutes);

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).send("Resource not found");
});
require('dotenv').config();


// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
