const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Access Denied. No Token Provided."
        });
    }

    const token = authHeader.split(" ")[1];

console.log("Received Token:", token);
console.log("JWT Secret:", process.env.JWT_SECRET);

try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token:", decoded);

    req.user = decoded;

    next();

} catch (error) {

    console.log("JWT Error:", error.message);

    return res.status(401).json({
        success: false,
        message: "Invalid or Expired Token."
    });

}
};
module.exports = verifyToken;