/**
 * AI Vision Hub — Server entry point.
 *
 * Flow:
 *   1. Load environment variables
 *   2. Connect to MongoDB
 *   3. Start the Express HTTP server
 *
 * If the database connection fails, the process exits with a clear error
 * so the hosting environment can restart it cleanly.
 */

const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const env = require("./config/env");
const connectDB = require("./config/db");
const { errorMiddleware, notFoundHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const scanRoutes = require("./routes/scanRoutes");
const chatRoutes = require("./routes/chatRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

const app = express();

// ---------------------------------------------------------------------------
// Global middleware
// ---------------------------------------------------------------------------

// Security headers
app.use(
  helmet({
    // Allow the client to load its own resources if this server ever serves them.
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS — restrict to the configured client URL in production.
app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return cb(null, true);
      const allowed = [env.CLIENT_URL].filter(Boolean);
      if (env.NODE_ENV !== "production" || allowed.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Request parsing
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Logging
if (env.NODE_ENV !== "test") {
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
}

// Serve uploaded images statically
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, env.UPLOAD_DIR), {
    maxAge: "7d",
  })
);

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "AI Vision Hub API is running",
    data: {
      env: env.NODE_ENV,
      aiProvider: env.AI_PROVIDER,
      uptime: process.uptime(),
    },
  });
});

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/scans", scanRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/feedback", feedbackRoutes);

// Root redirect to health
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "AI Vision Hub API — see /api/health",
  });
});

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------
app.use(notFoundHandler);
app.use(errorMiddleware);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
async function start() {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      console.log(
        `[server] AI Vision Hub running on http://localhost:${env.PORT} (env=${env.NODE_ENV}, ai=${env.AI_PROVIDER})`
      );
    });
  } catch (err) {
    console.error("[server] Failed to start:", err.message);
    process.exit(1);
  }
}

start();

module.exports = app; // for potential testing
