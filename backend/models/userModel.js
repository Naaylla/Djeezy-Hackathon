const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname: {
        type: String, 
        required: [true, "Please enter your first name"],
        trim: true,
    },
    lastname: {
        type: String,
        required: [true, "Please enter your last name"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
    },
    nationalCardNumber: {
        type: String,
        required: [true, "Please enter your national card number"],
        unique: true,
        trim: true,
    },
    birthDate: {
        type: Date,
        required: [true, "Please enter your birth date"],
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
