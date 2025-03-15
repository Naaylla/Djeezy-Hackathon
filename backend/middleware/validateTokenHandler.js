const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
    let authorization = req.headers.authorization;
    
    if (!authorization || !authorization.startsWith("Bearer")) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }

    const token = authorization.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;  // ✅ Store the whole decoded object
        console.log("Decoded Token:", decoded);
        next();
    } catch (err) {
        console.error("JWT Verification Error:", err);
        res.status(401);
        throw new Error("Not authorized, token failed");
    }
});

module.exports = validateToken;
