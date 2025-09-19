require("dotenv").config();
const express = require("express");
const connectToDatabase = require("./config/database");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const requestRoutes = require("./routes/request.routes");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/requests", requestRoutes);

connectToDatabase()
    .then(() => {
        console.info("*** Successfully connected to Database ***");
        app.listen(PORT, () => {
            console.info(`*** Server is up & running on port ${PORT} ***`);
        });
    })
    .catch((err) => {
        console.error("*** Failed to connect to Database ***", err);
        process.exit(1);
    });
