const BusStop = require('../models/busStopModel');
const StopSequence = require('../models/StopSequence');
// Controller function to add bus stops from a JSON file
const addBusStopsFromJson = async (req, res) => {
  const busStopsData = req.body;
  console.log('Received Bus Stops Data:', busStopsData);

  try {
    // Fetch and update the stop sequence to ensure unique stopNo
    const stopSeq = await StopSequence.findOneAndUpdate(
      { name: 'busStop' },
      { $inc: { nextSequence: busStopsData.length } },  // Increment sequence by the number of bus stops being added
      { new: true, upsert: true }
    );

    // Manually generate stopNo for each bus stop in the incoming data
    const busStopsWithStopNo = busStopsData.map((busStop, index) => {
      const stopNumber = `S${(stopSeq.nextSequence - busStopsData.length + index + 1).toString().padStart(6, '0')}`;
      return { ...busStop, stopNo: stopNumber };
    });

    // Bulk insert bus stops into the database
    const busStops = await BusStop.insertMany(busStopsWithStopNo);
    res.status(201).json({ message: 'Bus stops added successfully', busStops });
  } catch (err) {
    console.error('Error adding bus stops:', err.message);
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

const getNearbyStops = async (latitude, longitude) => {
  try {
    // Find stops within 6 km
    const stops = await BusStop.find({
      type: "stop",
      coordinates: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: 20000, // 6 km radius
        },
      },
    });

    // Find all terminals regardless of distance
    const terminals = await BusStop.find({ type: "terminal" });

    // Combine stops and terminals into a single response
    const nearbyStops = [...stops, ...terminals];

    // Send the combined result to the frontend
    return nearbyStops
  } catch (err) {
    console.error("Error fetching nearby bus stops:", err);
  }
};


module.exports = {
  addBusStopsFromJson,
  getAllBusStops,
  getNearbyStops,
};
