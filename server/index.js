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
const UserRoutes = require("./routes/UserRoutes.js")
const { getBusLocations } = require("./controllers/busController");
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
app.use("/api/user", UserRoutes)
connectDB();

const sendBusDataToClient = async (socket) => {
  try {
    const buses = await Bus.find();

    const busesWithRouteInfo = await Promise.all(buses.map(async (bus) => {
      const route = await Route.findById(bus.RouteNo[bus.currentRouteNo]); 
      return {
        VehicleNo: bus.VehicleNo,
        BusNo: bus.BusNo,
        busCoordinates: bus.busCoordinates,
        busStatus: bus.busStatus,
        currentRoute: route ? route.routeName : "Unknown",
        currentRouteNo: bus.currentRouteNo,
        busType: bus.busType,
        busDistrict: bus.busDistrict,
      };
    }));

    socket.emit("busLocationUpdate", busesWithRouteInfo);

  } catch (err) {
    console.error("Error fetching bus data:", err);
  }
};

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.on("getNearbyStops", async (userLocation) => {
    console.log("recieve")
    console.log(userLocation)
    const { latitude, longitude } = userLocation;

    const nearbyStops = await getNearbyStops(latitude, longitude);
    const busLocations = await getBusLocations();
    try {
      socket.emit("nearbyStops", nearbyStops);
      socket.emit("busLocations", busLocations); 
    } catch (err) {
      console.error("Error fetching nearby bus stops:", err);
    }
  });

  setInterval(async () => {
    const busLocations = await getBusLocations();
    socket.emit("busLocations", busLocations); 
  }, 7000);
  

  socket.on("disconnect", () => {
    console.log("WebSocket disconnected");
  });
});



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
