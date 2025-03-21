const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../db/user"); // Import User model
const mongoose = require("mongoose"); // Mongoose

// Secret key for JWT (Keep this in an environment variable in production)
const JWT_SECRET = "your_jwt_secret_key"; // Change this to a secure value

// Helper function to validate email format
function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!regex.test(email)) {
        throw new Error("Invalid email format.");
    }
}

// Helper function for password validation
function validatePassword(password) {
    if (!password || password.length < 6) {
        throw new Error("Password is required and should be at least 6 characters long.");
    }
    return password;
}

// Login handler for both admin and client
async function loginUser(model) {
    try {
        // Validate email
        validateEmail(model.email);

        // Find the user by email
        const user = await User.findOne({ email: model.email.trim() });
        if (!user) {
            throw new Error("User not found.");
        }

        // Compare the password with the stored hashed password
        const isMatch = await bcrypt.compare(model.password, user.password);
        if (!isMatch) {
            throw new Error("Invalid password.");
        }

        // Generate a JWT token
        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin }, 
            JWT_SECRET, 
            { expiresIn: '1h' } // Token expiration time
        );

        // Return user data along with the token
        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                image: user.image || null
            },
            token
        };
    } catch (err) {
        throw new Error(`Login failed: ${err.message}`);
    }
}

module.exports = { loginUser };
