const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
    try {
        const cookies = req.cookies;

        const { accessToken } = cookies;
        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: "No token provided",
            });
        }

        const decoded = await jwt.verify(accessToken, process.env.JWT_SECRET);
        if (!decoded || !decoded._id) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }

        const { _id } = decoded;

        req.userId = _id;

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
};

module.exports = {
    userAuth,
};
