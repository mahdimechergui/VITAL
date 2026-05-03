const express = require("express");
const app = express();

app.use(express.json());

const cors = require("cors");
app.use(cors());

global.logs = [];

// 🔐 Middlewares
const blocker = require("./middlewares/blocker");
const logger = require("./middlewares/logger");
const rateLimiter = require("./middlewares/rateLimiter");

// ✅ IMPORTANT: middleware order
app.use(blocker);
app.use(rateLimiter);
app.use(logger);

// AI Routes Only (Other features use Supabase natively)
const aiRoutes = require("./routers/aiRoutes");
app.use("/ai", aiRoutes);

module.exports = app;