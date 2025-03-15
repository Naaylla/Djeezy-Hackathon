const express = require("express");
const router = express.Router();
const { createCampaign, updateCampaign, donateToCampaign, getCampaign } = require("../controllers/campaignController");

router.post("/", createCampaign);
router.put("//:id", updateCampaign);
router.post("/:id/donate", donateToCampaign);
router.get("/:id", getCampaign); // Search by ID
router.get("/", getCampaign); // Search by Name or get all

module.exports = router;
