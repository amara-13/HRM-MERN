require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const connection = require("./db/db");
const authRoutes = require("./routes/authRoutes");
const PORT = process.env.PORT || 5000;
const roleRoutes = require("./routes/roleRoutes");
const rbacTestRoutes = require("./routes/rbcaTestRoutes");
const permissionRoutes = require("./routes/permissionRoutes");

const app = express();
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: process.env.CORS_CREDENTIALS,
}));
app.use(express.json());
connection();
app.get("/", (req, res) => {
    res.send("Server is working");
});
app.use("/api/roles", roleRoutes);
app.use("/api/rbac-test", rbacTestRoutes);
app.use("/auth", authRoutes);
app.use("/api/permissions",permissionRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error"
    });
});

app.listen(PORT, () => {
    console.log(`server run on port ${PORT}`);
});
