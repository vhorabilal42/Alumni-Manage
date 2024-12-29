require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const databaseConnection = require("../src/config/DBConnection");
const adminRoutes = require("../src/routes/adminRoutes");
const alumniRoutes = require("../src/routes/alumniRoutes");
const alumniNews = require("../src/routes/adminNews");
const events = require("./routes/eventRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to the database first, then start the server
databaseConnection()
  .then(() => {
    console.log("Database Connection {index.js}");

    // Setup middleware
    app.use(cors({ origin: process.env.CORS_ORIGIN }));
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));

    // Serve static files
    app.use(express.static("public"));

    // Use routes
    app.use("/v1", adminRoutes);
    app.use("/v2", alumniRoutes);
    app.use("/v3", alumniNews);
    app.use("/event", events);

    // Handle undefined routes
    app.all("*", (req, res) => {
      res.status(404).json({
        status: false,
        message: `Can't find ${req.originalUrl} on this server`,
      });
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the app if database connection fails
  });
