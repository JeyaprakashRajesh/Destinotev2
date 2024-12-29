const Bus = require("../models/BusModel"); 

const addBus = async (req, res) => {
  const { VehicleNo, BusNo, RouteNo, DriverId, busType, busDistrict } = req.body;

  // Validate required fields
  if (!VehicleNo || !BusNo || !RouteNo || !DriverId || !busType || !busDistrict) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newBus = new Bus(req.body);

    await newBus.save();

    return res.status(201).json({ message: "Bus added successfully", bus: newBus });
  } catch (err) {
    console.error("Error adding bus:", err.message);
    return res.status(500).json({ error: "Failed to add bus", message: err.message });
  }
};


const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    return res.status(200).json(buses);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch buses", message: err.message });
  }
};

module.exports = {
  addBus,
  getAllBuses, 
};
