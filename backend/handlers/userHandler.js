const bcrypt = require("bcryptjs");
const User = require("../db/user"); // Import User model
const mongoose = require("mongoose"); // Mongoose

// Helper function for email validation
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

// Helper function for image URL validation
function validateImageUrl(url) {
    try {
        const parsedUrl = new URL(url);
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            throw new Error("Image URL must start with 'http' or 'https'.");
        }
    } catch (error) {
        throw new Error("Invalid image URL. Please provide a valid URL.");
    }
}

// Helper function to hash the password
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

// Add a new user
async function addUser(model) {
    try {
        if (!model.name || typeof model.name !== "string" || !model.name.trim()) {
            throw new Error("User name is required and should be a non-empty string.");
        }

        validateEmail(model.email);
        const password = validatePassword(model.password);
        const hashedPassword = await hashPassword(password);

        if (model.image) {
            validateImageUrl(model.image);
        }

        const newUser = new User({
            name: model.name.trim(),
            email: model.email.trim(),
            password: hashedPassword,
            isAdmin: model.isAdmin || false,
            image: model.image || null,
        });

        await newUser.save();
        return {
            success: true,
            message: "User added successfully.",
            data: newUser,
        };
    } catch (err) {
        return {
            success: false,
            message: `Error creating user: ${err.message}`,
        };
    }
}

// Get all users
async function getUsers() {
    try {
        const users = await User.find();
        return {
            success: true,
            message: "Users fetched successfully.",
            data: users,
        };
    } catch (error) {
        return {
            success: false,
            message: `Error fetching users: ${error.message}`,
        };
    }
}

// Update an existing user
async function updateUser(id, model) {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid user ID format.");
        }

        const user = await User.findById(id);
        if (!user) {
            throw new Error("User not found.");
        }

        if (model.name) user.name = model.name.trim();
        if (model.email) {
            validateEmail(model.email);
            user.email = model.email.trim();
        }
        if (model.password) {
            const hashedPassword = await hashPassword(model.password);
            user.password = hashedPassword;
        }
        if (model.isAdmin !== undefined) user.isAdmin = model.isAdmin;
        if (model.image) {
            validateImageUrl(model.image);
            user.image = model.image;
        }

        await user.save();
        return {
            success: true,
            message: "User updated successfully.",
            data: user,
        };
    } catch (err) {
        return {
            success: false,
            message: `Error updating user: ${err.message}`,
        };
    }
}

// Delete user by ID
async function deleteUser(id) {
    try {
        const deleteResult = await User.deleteOne({ _id: id });
        if (deleteResult.deletedCount === 0) {
            throw new Error("User not found.");
        }
        return {
            success: true,
            message: "User deleted successfully.",
        };
    } catch (err) {
        return {
            success: false,
            message: `Error deleting user: ${err.message}`,
        };
    }
}

// Get a user by ID
async function getUserById(id) {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid user ID format.");
        }

        const user = await User.findById(id);
        if (!user) {
            throw new Error("User not found.");
        }
        return {
            success: true,
            message: "User fetched successfully.",
            data: user,
        };
    } catch (err) {
        return {
            success: false,
            message: `Error fetching user by ID: ${err.message}`,
        };
    }
}


// Add a new search function for querying users by name
async function searchUsers(query) {
    try {
        // Perform a case-insensitive search for user names that contain the query
        const users = await User.find({
            name: { $regex: query, $options: 'i' }, // 'i' for case-insensitive
        });
        return {
            success: true,
            message: "Search results fetched successfully.",
            data: users,
        };
    } catch (error) {
        return {
            success: false,
            message: `Error searching users: ${error.message}`,
        };
    }
}


// Get user profile data
async function getUserProfile(userId) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found.");
        }
        return {
            success: true,
            message: "User profile fetched successfully.",
            data: user,
        };
    } catch (err) {
        return {
            success: false,
            message: `Error fetching user profile: ${err.message}`,
        };
    }
}

// Update user profile data
async function updateUserProfile(userId, model) {
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error("Invalid user ID format.");
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found.");
        }

        if (model.name) user.name = model.name.trim();
        if (model.email) {
            validateEmail(model.email);
            user.email = model.email.trim();
        }
        if (model.password) {
            const hashedPassword = await hashPassword(model.password);
            user.password = hashedPassword;
        }
        if (model.isAdmin !== undefined) user.isAdmin = model.isAdmin;
        if (model.image) {
            validateImageUrl(model.image);
            user.image = model.image;
        }

        await user.save();
        return {
            success: true,
            message: "User profile updated successfully.",
            data: user,
        };
    } catch (err) {
        return {
            success: false,
            message: `Error updating user profile: ${err.message}`,
        };
    }
}


module.exports = { addUser, updateUser, deleteUser, getUsers, getUserById , searchUsers , updateUserProfile  , getUserProfile};
