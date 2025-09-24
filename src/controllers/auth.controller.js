const { validateSignupData, validateLoginData } = require("../utils/validation");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const result = validateSignupData(req);

        if (!result.success) {
            return res.status(400).json(result);
        }

        const emailExists = await User.findOne({
            email: email,
        });
        if (emailExists) {
            return res.status(400).send({
                success: false,
                message: "An account with this email already exists.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        user.save();

        return res.status(201).json({
            success: true,
            message: "Account created successfully.",
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || "Invalid request data",
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        validateLoginData(req);

        const user = await User.findOne({
            email: email,
        });
        if (!user) {
            return res.status(401).send({
                success: false,
                message: "Invalid credentials",
            });
        }

        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            return res.status(401).send({
                success: false,
                message: "Invalid credentials",
            });
        }

        const accessToken = await user.getJwt();

        res.cookie("accessToken", accessToken, {
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        });

        return res.status(201).json({
            success: true,
            data: user,
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message || "Invalid request data",
        });
    }
};

const logout = async (req, res) => {
    res.cookie("accessToken", null, {
        expires: new Date(0),
    });

    return res.status(201).json({
        success: true,
        message: "User logged out successfully",
    });
};

module.exports = {
    signup,
    login,
    logout,
};
