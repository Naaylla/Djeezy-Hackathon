const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// @desc Register a user
// @route POST /api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { firstname, lastname, email, password, nationalCardNumber, birthDate } = req.body;
    if (!firstname || !lastname || !email || !password || !nationalCardNumber || !birthDate) {
        res.status(400);
        throw new Error("Please fill in all fields");
    }
    const userAvailable = await User.findOne(nationalCardNumber);
    if (userAvailable) {
        res.status(400);
        throw new Error("User already exists");
    }

    userAvailable = await User.findOne(email);
    if (userAvailable) {
        res.status(400);
        throw new Error("User already exists");
    }

});

// @desc Login a user
// @route POST /api/users/login  <-- CHANGED TO POST
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    res.json({ message: "User logged in" });
});

// @desc Get current user info
// @route GET /api/users/current
// @access Private
const currentUser = asyncHandler(async (req, res) => {
    res.json({ message: "User info" });
});

module.exports = { registerUser, loginUser, currentUser };
