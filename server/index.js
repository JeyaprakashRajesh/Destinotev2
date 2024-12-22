const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const busStopRoutes = require("./routes/busStopRoutes");
const BusStop = require("./models/busStopModel"); // Import the BusStop model

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // allow all origins or specify the React Native frontend URL
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json()); // for parsing JSON request body
app.use("/api/busstops", busStopRoutes);

connectDB();

// Set up WebSocket connection
io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.on("getNearbyStops", (userLocation) => {
    // Logic to get bus stops within 6 km of the user's location
    const { latitude, longitude } = userLocation;

    BusStop.find({
      coordinates: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: 6000, // 6 km radius
        },
      },
    })
      .then((stops) => {
        // Send the nearby bus stops to the frontend
        socket.emit("nearbyStops", stops);
      })
      .catch((err) => {
        console.error("Error fetching nearby bus stops:", err);
      });
  });

  socket.on("disconnect", () => {
    console.log("WebSocket disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
