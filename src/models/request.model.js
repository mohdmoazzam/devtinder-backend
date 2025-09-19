const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: {
                values: ["ignored", "interested", "accepted", "rejected"],
                message: "{VALUE} is not a valid request status",
            },
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;
