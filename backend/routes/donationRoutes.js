const express = require("express");
const router = express.Router();

router.post("/donate", (req, res) => {
    console.log(req.body);
    res.json({ message: "Donation successful" });
});

router.get("/useDonations", (req, res) => {
    res.json({ message: "Donations retrieved" });
});

router.get("/donation/:id", (req, res) => {
    res.json({ message: "Donation retrieved" });
});

module.exports = router;