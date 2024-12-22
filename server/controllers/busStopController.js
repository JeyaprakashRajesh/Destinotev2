const BusStop = require('../models/busStopModel');

// Controller function to add bus stops from a JSON file
const addBusStopsFromJson = async (req, res) => {
  const busStopsData = req.body;
  console.log('Received Bus Stops Data:', busStopsData); // Log the received data

  try {
    // Bulk insert bus stops into the database
    const busStops = await BusStop.insertMany(busStopsData);
    res.status(201).json({ message: 'Bus stops added successfully', busStops });
  } catch (err) {
    console.error('Error adding bus stops:', err.message); // Log any errors
    res.status(400).json({ error: 'Failed to add bus stops', message: err.message });
  }
};


// Get all bus stops
const getAllBusStops = async (req, res) => {
  try {
    const busStops = await BusStop.find();
    res.status(200).json(busStops);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch bus stops', message: err.message });
  }
};

module.exports = {
  addBusStopsFromJson,
  getAllBusStops
};
