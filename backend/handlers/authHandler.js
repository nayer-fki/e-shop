const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../db/user"); // Import User model
const { jwtSecret, jwtExpiry } = require("../config/jwtConfig");

// Blacklist for logout tokens
const tokenBlacklist = new Set();

// Login Function
async function login(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: "Invalid email or password." });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, isAdmin: user.isAdmin },
            jwtSecret,
            { expiresIn: jwtExpiry }
        );

        res.status(200).send({
            message: "Login successful.",
            token,
            user: { id: user._id, email: user.email, name: user.name, isAdmin: user.isAdmin },
        });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
}

// Logout Function
function logout(req, res) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(400).send({ message: "Token is missing." });
    }

    if (tokenBlacklist.has(token)) {
        return res.status(400).send({ message: "Token has already been logged out." });
    }

    tokenBlacklist.add(token);
    return res.status(200).send({ message: "Logout successful." });
}

// Register Function
async function register(req, res) {
    const { name, email, password, isAdmin, image } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: "User already exists with this email." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            isAdmin: isAdmin || false,
            image: image || '',
        });

        await user.save();

        const token = jwt.sign(
            { id: user._id, email: user.email, isAdmin: user.isAdmin },
            jwtSecret,
            { expiresIn: jwtExpiry }
        );

        res.status(201).send({
            message: "Registration successful.",
            token,
            user: { id: user._id, email: user.email, name: user.name, isAdmin: user.isAdmin },
        });
    } catch (error) {
        console.error("Registration error:", error.message);
        res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
}

// Get Current User Details (/me)
async function getUserDetails(req, res) {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token is missing." });
        }

        // Verify the token and get the user data
        const decoded = jwt.verify(token, jwtSecret);
        const user = await User.findById(decoded.id); // Find the user by the decoded ID

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Exclude sensitive information like password from the response
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            image: user.image, // Optional field
        });
    } catch (error) {
        console.error("Error fetching user data:", error.message);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { login, logout, register, getUserDetails };
