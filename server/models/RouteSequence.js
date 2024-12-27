const mongoose = require('mongoose');

// Define the schema for RouteSequence
const routeSequenceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  nextSequence: {
    type: Number,
    required: true,
    default: 1
  }
}); 

const RouteSequence = mongoose.model('RouteSequence', routeSequenceSchema);

module.exports = RouteSequence;
