const User = require("../models/user.model");
const { validateEditProfileData } = require("../utils/validation");
const Request = require("../models/request.model");

const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById({ _id: userId });

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { firstName, lastName, avatar, about, skills, age, gender } = req.body;
        validateEditProfileData(req);

        const user = await User.findByIdAndUpdate(
            { _id: userId },
            {
                firstName,
                lastName,
                avatar,
                about,
                skills,
                age,
                gender,
            },
            {
                new: true,
            },
        );
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message || "Invalid request data",
        });
    }
};

const getUserConnections = async (req, res) => {
    try {
        const { limit, page, sortBy, order } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const userId = req.userId;

        const acceptedRequests = await Request.find({
            $or: [
                {
                    receiverId: userId,
                },
                {
                    senderId: userId,
                },
            ],
            status: "accepted",
        })
            .populate("senderId", ["firstName", "lastName", "avatar", "age", "gender", "about "])
            .populate("receiverId", ["firstName", "lastName", "avatar", "age", "gender", "about "])
            .sort({ [sortBy]: order === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(limit);

        const total = await Request.countDocuments({
            $or: [
                {
                    receiverId: userId,
                },
                {
                    senderId: userId,
                },
            ],
            status: "accepted",
        });

        const totalPages = Math.ceil(total / Number(limit));

        const response = acceptedRequests.map((row) => {
            if (row.senderId._id.toString() === userId) {
                return row.receiverId;
            }
            return row.senderId;
        });

        return res.status(200).json({
            success: true,
            data: response,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages,
                hasNextPage: Number(page) < totalPages,
                hasPrevPage: Number(page) > 1,
            },
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const { limit, page, sortBy, order } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const userId = req.userId;

        const requests = await Request.find({
            $or: [
                {
                    receiverId: userId,
                },
                {
                    senderId: userId,
                },
            ],
        });

        const excludedUserIds = new Set();

        requests.forEach((request) => {
            excludedUserIds.add(request.senderId);
            excludedUserIds.add(request.receiverId);
        });

        const query = {
            _id: { $nin: [...excludedUserIds, userId] },
        };

        const users = await User.find(query)
            .sort({ [sortBy]: order === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(query);

        const totalPages = Math.ceil(total / Number(limit));

        const response = users.map((user) => {});

        return res.status(200).json({
            success: true,
            data: users,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages,
                hasNextPage: Number(page) < totalPages,
                hasPrevPage: Number(page) > 1,
            },
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    getUserConnections,
    getUsers,
};
