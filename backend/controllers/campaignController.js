const DonationCampaign = require("../models/campaignModel");
const asyncHandler = require("express-async-handler");

const createCampaign = async (req, res) => {
    try {
        const { name, description, amount, attachments } = req.body;
        const campaign = new DonationCampaign({ name, description, amount, attachments });
        await campaign.save();
        res.status(201).json({ message: "Campaign created successfully", campaign });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateCampaign = async (req, res) => {
    try {
        const campaign = await DonationCampaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!campaign) return res.status(404).json({ message: "Campaign not found" });

        res.status(200).json({ message: "Campaign updated successfully", campaign });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const donateToCampaign = async (req, res) => {
    try {
        const { amount } = req.body;
        if (amount <= 0) return res.status(400).json({ message: "Donation amount must be greater than zero" });

        const campaign = await DonationCampaign.findById(req.params.id);
        if (!campaign) return res.status(404).json({ message: "Campaign not found" });

        campaign.amount += amount; // Increase the total amount
        await campaign.save();

        res.status(200).json({ message: "Donation successful", campaign });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getCampaign = async (req, res) => {
    try {
        // If a campaign ID is passed as a parameter, find it by ID
        if (req.params.id) {
            const campaign = await DonationCampaign.findById(req.params.id);
            if (!campaign) return res.status(404).json({ message: "Campaign not found" });
            return res.status(200).json({ campaign });
        }

        // If a search query parameter 'name' is provided, search by name
        const { name } = req.query;
        if (name) {
            const campaigns = await DonationCampaign.find({
                name: { $regex: name, $options: "i" }, // Case-insensitive search
            });
            if (campaigns.length === 0) {
                return res.status(404).json({ message: "No campaigns found" });
            }
            return res.status(200).json({ campaigns });
        }

        // If neither 'id' nor 'name' is provided, return all campaigns
        const campaigns = await DonationCampaign.find();
        res.status(200).json({ campaigns });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { createCampaign, updateCampaign, donateToCampaign, getCampaign };

