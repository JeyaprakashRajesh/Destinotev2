const mongoose = require('mongoose');

// Define the schema for a bus stop
const busStopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['stop', 'terminal'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true,
    index: '2dsphere'  // Enables geospatial queries for location data
  }
}, {
  timestamps: true
});

// Create and export the model
const BusStop = mongoose.model('BusStop', busStopSchema);
module.exports = BusStop;
