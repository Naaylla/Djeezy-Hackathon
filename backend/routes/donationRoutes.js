const express = require("express");
const router = express.Router();
const { getReceiverDonations, getDonorDonations, getDonationByID, getCampaignDonations } = require("../controllers/donationController");

// Get a specific donation by its ID
router.get("/donation/:id", getDonationByID);

// Get all donations for a specific campaign
router.get("/campaign/:campaignId/donations", getCampaignDonations);

// Get all donations received by a specific receiver
router.get("/receiver/:receiverName/donations", getReceiverDonations);

// Get all donations made by a specific donor
router.get("/donor/:donorID/donations", getDonorDonations);

module.exports = router;
