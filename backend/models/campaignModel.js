const mongoose = require("mongoose");

const donationCampaignSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the campaign name"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please enter the campaign description"],
    },
    amount: {
        type: Number,
        required: [true, "Please specify the donation goal amount"],
        min: [0, "Amount cannot be negative"],
    },
    attachments: {
        type: [String], // List of image URLs
        default: [],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // This will store the ObjectId of the user who created the campaign
        ref: 'User', // Assuming you have a User model and it is linked to the user collection
        required: [true, "User ID is required"], // You can make it required if necessary
    }
}, { timestamps: true });

module.exports = mongoose.model("DonationCampaigns", donationCampaignSchema);
