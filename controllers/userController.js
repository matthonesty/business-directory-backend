const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const upload = require('./../utils/upload'); 
const fs = require('fs');
const path = require('path');


// Helper function to validate password
const passwordValidation = (password) => {
  const minLength = 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return password.length >= minLength && hasLetter && hasCharacter;
};

// Register new user
exports.register = (req, res) => {
  // Use upload.single to handle profile picture upload
  upload.single('profilePicture')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const { username, email, password, firstname, lastname } = req.body;
    let profilePictureUrl = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      const userByUsername = await prisma.user.findUnique({ where: { username } });
      const userByEmail = await prisma.user.findUnique({ where: { email } });

      if (userByUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      if (userByEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }

      if (!passwordValidation(password)) {
        return res.status(400).json({
          message: "Password must be at least 8 characters long and contain a letter and a special character",
        });
      }

      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);

      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: passwordHash,
          firstname,
          lastname,
          profilePicture: profilePictureUrl, // Save profile picture URL in the database
        },
      });

      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.status(201).json({ token, user: newUser });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // Include user ID and other necessary information in the response
    res.json({
      token,
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        firstname: true,
        lastname: true,
        profilePicture: true,
        createdAt: true,
        updatedAt: true,
        // Don't include password
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  // Use upload middleware to handle profile picture
  upload.single('profilePicture')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { username, firstname, lastname, email } = req.body;
      
      // Get current user data
      const currentUser = await prisma.user.findUnique({
        where: { id: req.user.id },
      });
      
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if username is taken by another user
      if (username && username !== currentUser.username) {
        const existingUser = await prisma.user.findUnique({
          where: { username },
        });
        
        if (existingUser) {
          return res.status(400).json({ message: "Username already taken" });
        }
      }
      
      // Check if email is taken by another user
      if (email && email !== currentUser.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });
        
        if (existingUser) {
          return res.status(400).json({ message: "Email already registered" });
        }
      }
      
      // Handle profile picture update
      let profilePictureUrl = currentUser.profilePicture;
      
      if (req.file) {
        // If there's a new profile picture, update the URL
        profilePictureUrl = `/uploads/${req.file.filename}`;
        
        // Delete old profile picture if it exists
        if (currentUser.profilePicture) {
          const oldPicPath = path.join(__dirname, '..', currentUser.profilePicture);
          if (fs.existsSync(oldPicPath)) {
            fs.unlinkSync(oldPicPath);
          }
        }
      }
      
      // Update user in database
      const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          username: username || currentUser.username,
          firstname: firstname || currentUser.firstname,
          lastname: lastname || currentUser.lastname,
          email: email || currentUser.email,
          profilePicture: profilePictureUrl,
        },
        select: {
          id: true,
          username: true,
          email: true,
          firstname: true,
          lastname: true,
          profilePicture: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      
      res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
};

// Delete user profile
exports.deleteProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Delete user's profile picture if it exists
    if (user.profilePicture) {
      const picPath = path.join(__dirname, '..', user.profilePicture);
      if (fs.existsSync(picPath)) {
        fs.unlinkSync(picPath);
      }
    }
    
    // Delete all related records (this will depend on your database schema)
    // For example, delete user's comments, ratings, etc.
    
    // Finally delete the user
    await prisma.user.delete({
      where: { id: req.user.id },
    });
    
    res.json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a token and set expiration
    const token = crypto.randomBytes(3).toString("hex").toUpperCase(); // Generates a 6-character code
    const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour

    // Store the token in the database
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    // Set up nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or any other email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Configure the email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Verification Code",
      text: `You requested a password reset. Please use the following verification code to reset your password: ${token}. The code is valid for 1 hour.`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.json({ message: "Verification code sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Find the token in the database
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    // Check if the token is invalid or expired
    if (!resetToken || resetToken.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    // Validate the new password (e.g., length, special characters)
    if (!passwordValidation(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain a letter and a special character",
      });
    }

    // Hash the new password
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(newPassword, salt);

    // Update the user's password
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: passwordHash },
    });

    // Delete the used token
    await prisma.passwordResetToken.delete({ where: { token } });

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
