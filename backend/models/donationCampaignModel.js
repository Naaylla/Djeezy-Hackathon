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
    }
}, { timestamps: true });

module.exports = mongoose.model("DonationCampaigns", donationCampaignSchema);
