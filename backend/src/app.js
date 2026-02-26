const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const globalErrorHandler = require("./middlewares/errorHandler");
const roomRoutes = require("./routes/roomRoutes");
const AppError = require("./utils/AppError");

const app = express();

// ─── CORS MUST be first — before helmet and everything else ─────────────────
// Strip trailing slashes from FRONTEND_URL env var entries
const rawOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((u) => u.trim().replace(/\/+$/, ""))
  : [];

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  ...rawOrigins,
].filter(Boolean);

console.log("✅ CORS allowed origins:", allowedOrigins);

const corsOptions = {
  origin: (origin, callback) => {
    // No origin = Postman / curl / mobile — always allow
    if (!origin) return callback(null, true);
    const normalized = origin.replace(/\/+$/, "");
    if (allowedOrigins.includes(normalized)) return callback(null, true);
    console.warn("🚫 CORS blocked origin:", origin);
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200, // Some browsers (IE11) choke on 204
};

// Handle ALL OPTIONS preflight requests immediately
app.options("*", cors(corsOptions));

// Apply CORS to all routes
app.use(cors(corsOptions));

// ─── Security Middleware (after CORS) ───────────────────────────────────────
app.use(helmet());

// ─── Rate Limiting ───────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api", limiter);

// ─── Body Parsing ────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ─────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    allowedOrigins, // Helpful for debugging — remove in final prod if desired
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/rooms", roomRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.all("*", (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(globalErrorHandler);

module.exports = app;
