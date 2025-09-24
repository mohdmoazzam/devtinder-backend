const User = require("../models/user.model");
const Request = require("../models/request.model");
const { validatePaginationParams } = require("../utils/validation");

const sendRequest = async (req, res) => {
    try {
        const { status, receiverId } = req.body;

        const userId = req.userId;

        const allowedStatus = ["interested", "ignored"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status: ${status}`,
            });
        }

        if (userId === receiverId) {
            return res.status(400).json({
                success: false,
                message: `User cannot perform this action on themselves`,
            });
        }

        const toUser = await User.findById({ _id: receiverId });
        if (!toUser) {
            return res.status(400).json({
                success: false,
                message: `Could not find user with Id`,
            });
        }

        const existingRequest = await Request.findOne({
            $or: [
                {
                    senderId: userId,
                    receiverId,
                },
                {
                    senderId: receiverId,
                    receiverId: userId,
                },
            ],
        });
        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: "A request already exists between these users",
            });
        }

        const request = new Request({
            senderId: userId,
            receiverId,
            status,
        });
        request.save();

        return res.status(201).json({
            success: true,
            message: "Request sent successfully",
            data: request,
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

const reviewRequest = async (req, res) => {
    try {
        const { status, requestId } = req.body;

        const userId = req.userId;

        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status: ${status}`,
            });
        }

        const request = await Request.findOne({
            _id: requestId,
            receiverId: userId,
            status: "interested",
        });
        if (!request) {
            return res.status(404).json({
                success: false,
                message: "No request found for this user",
            });
        }

        request.status = status;
        await request.save();

        return res.status(201).json({
            success: true,
            message: `Request ${status}`,
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

const getReceivedRequests = async (req, res) => {
    try {
        const result = validatePaginationParams(req);
        if (!result.success) {
            return res.status(400).json(result);
        }
        const { limit, page, sortBy, order } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const userId = req.userId;

        const receivedRequests = await Request.find({
            receiverId: userId,
            status: "interested",
        })
            .populate("senderId", ["firstName", "lastName", "avatar", "age", "gender", "about "])
            .sort({ [sortBy]: order === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(limit);

        const total = await Request.countDocuments({
            receiverId: userId,
            status: "interested",
        });

        const totalPages = Math.ceil(total / Number(limit));

        const response = receivedRequests.map((receivedRequest) => {
            return {
                requestId: receivedRequest._id.toString(),
                userId: receivedRequest.senderId._id.toString(),
                firstName: receivedRequest.senderId.firstName,
                lastName: receivedRequest.senderId.lastName,
            };
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
        console.log(err);
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

module.exports = {
    sendRequest,
    reviewRequest,
    getReceivedRequests,
};
