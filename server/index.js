const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const busStopRoutes = require("./routes/busStopRoutes");
const BusStop = require("./models/busStopModel"); 
const {getNearbyStops} = require("./controllers/busStopController");
const routeRoutes = require("./routes/routeRoutes");
const busRoutes = require("./routes/busRoutes");
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json()); 
app.use("/api/busstops", busStopRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/buses", busRoutes);
connectDB();

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.on("getNearbyStops", async (userLocation) => {
    const { latitude, longitude } = userLocation;

    const nearbyStops = await getNearbyStops(latitude, longitude);
    try {
      socket.emit("nearbyStops", nearbyStops);
    }
    catch (err) {
      console.error("Error fetching nearby bus stops:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("WebSocket disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
