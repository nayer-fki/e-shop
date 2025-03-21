const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { 
    addUser, 
    updateUser, 
    deleteUser, 
    getUsers, 
    getUserById, 
    searchUsers, 
    updateUserProfile, 
    getUserProfile 
} = require("../handlers/userHandler");

// POST route - Add new user
router.post("", async (req, res) => {
    const model = req.body;
    try {
        const result = await addUser(model);
        if (result.success) {
            res.status(201).send(result);
        } else {
            res.status(400).send(result); // Bad request for validation errors
        }
    } catch (error) {
        console.error("Error adding user:", error.message);
        res.status(500).send({ success: false, message: "Internal Server Error", error: error.message });
    }
});

// GET route - Search users by query
router.get("/search", async (req, res) => {
    const query = req.query.search || '';  // Get the search query parameter
    try {
        const result = await searchUsers(query);
        if (result.success) {
            res.status(200).send(result);
        } else {
            res.status(500).send(result);
        }
    } catch (error) {
        console.error("Error searching users:", error.message);
        res.status(500).send({ success: false, message: "Internal Server Error", error: error.message });
    }
});

// GET route - Get all users
router.get("", async (req, res) => {
    try {
        const result = await getUsers();
        if (result.success) {
            res.status(200).send(result);
        } else {
            res.status(500).send(result);
        }
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).send({ success: false, message: "Internal Server Error", error: error.message });
    }
});

// PUT route - Update user by ID
router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const model = req.body;
    try {
        const result = await updateUser(id, model);
        if (result.success) {
            res.status(200).send(result);
        } else {
            const statusCode = result.message.includes("not found") ? 404 : 400;
            res.status(statusCode).send(result);
        }
    } catch (error) {
        console.error("Error updating user:", error.message);
        res.status(500).send({ success: false, message: "Internal Server Error", error: error.message });
    }
});

// DELETE route - Delete user by ID
router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ success: false, message: "Invalid ID format" });
    }
    try {
        const result = await deleteUser(id);
        if (result.success) {
            res.status(200).send(result);
        } else {
            res.status(404).send(result); // Not found
        }
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).send({ success: false, message: "Internal Server Error", error: error.message });
    }
});

// GET route - Get user by ID
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ success: false, message: "Invalid ID format" });
    }
    try {
        const result = await getUserById(id);
        if (result.success) {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    } catch (error) {
        console.error("Error fetching user by ID:", error.message);
        res.status(500).send({ success: false, message: "Internal Server Error", error: error.message });
    }
});

// PUT route - Update user profile (for the currently authenticated user)
router.put("/profile", async (req, res) => {
    const userId = req.user.id;  // Assuming the user ID is stored in the session or JWT token
    const model = req.body;
    try {
        const result = await updateUserProfile(userId, model);
        if (result.success) {
            res.status(200).send(result);
        } else {
            const statusCode = result.message.includes("not found") ? 404 : 400;
            res.status(statusCode).send(result);
        }
    } catch (error) {
        console.error("Error updating user profile:", error.message);
        res.status(500).send({ success: false, message: "Internal Server Error", error: error.message });
    }
});

// GET route - Get user profile (for the currently authenticated user)
router.get("/profile", async (req, res) => {
    const userId = req.user.id;  // Assuming the user ID is stored in the session or JWT token
    try {
        const result = await getUserProfile(userId);
        if (result.success) {
            res.status(200).send(result);
        } else {
            res.status(404).send(result);
        }
    } catch (error) {
        console.error("Error fetching user profile:", error.message);
        res.status(500).send({ success: false, message: "Internal Server Error", error: error.message });
    }
});

module.exports = router;
