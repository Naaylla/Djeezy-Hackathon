const express = require("express");
const router = express.Router();
const DonationCampaign = require("../models/DonationCampaign");
const { createCampaign, updateCampaign, donateToCampaign } = require("../controllers/donationController");

router.post("/", createCampaign);

router.put("/:id", updateCampaign);

router.post("/:id/donate", donateToCampaign);

module.exports = router;
