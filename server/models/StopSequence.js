const mongoose = require('mongoose');

// Define the schema for StopSequence
const stopSequenceSchema = new mongoose.Schema({
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

const StopSequence = mongoose.model('StopSequence', stopSequenceSchema);

module.exports = StopSequence;
