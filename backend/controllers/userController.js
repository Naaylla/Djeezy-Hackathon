const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// @desc Register a user
// @route POST /api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { firstname, lastname, email, password, nationalCardNumber, birthDate, idCardPicture } = req.body;

    // Validate that all fields are provided
    if (!firstname || !lastname || !email || !password || !nationalCardNumber || !birthDate || !idCardPicture) {
        res.status(400);
        throw new Error("Please fill in all fields");
        return;
    }

    // Check if the user with the same national card number exists
    const userAvailable = await User.findOne({ nationalCardNumber });
    if (userAvailable) {
        res.status(400);
        throw new Error("User already exists");
        return;
    }

    // Check if the user with the same email exists
    const userAvailable2 = await User.findOne({ email });
    if (userAvailable2) {
        res.status(400);
        throw new Error("User already exists");
        return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashed Pass", password);

    // Create the new user
    const user = await User.create({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        nationalCardNumber,
        birthDate,
        idCardPicture
    });

    console.log("User created", user);
    if (user) {
        res.status(201).json({ 
            _id: user.id, 
            firstname: user.firstname, 
            email: user.email,
            idCardPicture: user.idCardPicture
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

module.exports = { registerUser };
