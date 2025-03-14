const express = require("express");
const router = express.Router();

router.route("/", (req, res) => {
    res.status(200).json({ message: "Hello from Contact API" });
});

module.exports = router;