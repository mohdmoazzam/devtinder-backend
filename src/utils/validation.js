const validator = require("validator");

const validateSignupData = (req) => {
    const { firstName, lastName, email, password } = req.body;

    if (validator.isEmpty(firstName || "")) {
        return { success: false, message: "First name is required" };
    }
    if (!validator.isAlpha(firstName, "en-US", { ignore: " -" })) {
        return { success: false, message: "First name should contain only letters" };
    }

    if (validator.isEmpty(lastName || "")) {
        return { success: false, message: "Last name is required" };
    }
    if (!validator.isAlpha(lastName, "en-US", { ignore: " -" })) {
        return { success: false, message: "Last name should contain only letters" };
    }

    if (validator.isEmpty(email || "")) {
        return { success: false, message: "Email is required" };
    }
    if (!validator.isEmail(email)) {
        return { success: false, message: "Invalid email format" };
    }

    if (validator.isEmpty(password || "")) {
        return { success: false, message: "Password is required" };
    }
    if (!validator.isLength(password, { min: 8 })) {
        return { success: false, message: "Password must be at least 8 characters" };
    }
    if (!/[A-Z]/.test(password)) {
        return { success: false, message: "Password must contain at least one uppercase letter" };
    }
    if (!/[a-z]/.test(password)) {
        return { success: false, message: "Password must contain at least one lowercase letter" };
    }
    if (!/[0-9]/.test(password)) {
        return { success: false, message: "Password must contain at least one number" };
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        return { success: false, message: "Password must contain at least one special character" };
    }

    return { success: true, message: "Validation passed" };
};

const validateLoginData = (req) => {
    const { email, password } = req.body;
};

const validateEditProfileData = (req) => {
    const {} = req.body;
};

const validatePaginationParams = (req) => {
    let { limit, page, order } = req.query;

    if (limit > 50) {
        return { success: false, message: "Limit cannot be greater than 50" };
    }

    if (limit <= 0) {
        return { success: false, message: "Limit must be greater than 0" };
    }
    if (page <= 0) {
        return { success: false, message: "Page must be greater than 0" };
    }
    if (order && !["asc", "desc"].includes(order.toLowerCase())) {
        return { success: false, message: `Invalid order value: ${order}. Must be asc or desc` };
    }

    return { success: true, message: "Validation passed" };
};

module.exports = {
    validateSignupData,
    validateLoginData,
    validateEditProfileData,
    validatePaginationParams,
};
