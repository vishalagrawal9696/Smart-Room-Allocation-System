require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Connect to DB then start server
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (err) => {
    console.error("💥 Unhandled Promise Rejection:", err.name, err.message);
    server.close(() => process.exit(1));
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", (err) => {
    console.error("💥 Uncaught Exception:", err.name, err.message);
    process.exit(1);
  });

  // Graceful shutdown on SIGTERM
  process.on("SIGTERM", () => {
    console.log("👋 SIGTERM received. Shutting down gracefully.");
    server.close(() => {
      console.log("💤 Process terminated.");
    });
  });
});
