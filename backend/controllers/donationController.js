const asyncHandler = require("express-async-handler");
const { gateway, network, contract } = require('../blockchain/network/networkConnect');

const getReceiverDonations = asyncHandler(async (req, res) => {
    try {
        const { receiverName } = req.params;

        const donations = await contract.evaluateTransaction("getReceiverDonations", receiverName);

        res.status(200).json({ donations: JSON.parse(donations.toString()) });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const getDonorDonations = asyncHandler(async (req, res) => {
    try {
        const { donorID } = req.params;

        const donations = await contract.evaluateTransaction("getDonorDonations", donorID);

        res.status(200).json({ donations: JSON.parse(donations.toString()) });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const getDonationByID = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        const donation = await contract.evaluateTransaction("getDonationByID", id);

        res.status(200).json({ donation: JSON.parse(donation.toString()) });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const getCampaignDonations = asyncHandler(async (req, res) => {
    try {
        const { campaignId } = req.params;

        const donations = await contract.evaluateTransaction("getCampaignDonations", campaignId);

        res.status(200).json({ donations: JSON.parse(donations.toString()) });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = { getReceiverDonations, getDonorDonations, getDonationByID, getCampaignDonations };
