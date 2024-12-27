const mongoose = require('mongoose');
const StopSequence = require('./StopSequence');  
const busStopSchema = new mongoose.Schema({
  stopNo: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  state: {
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
    index: '2dsphere'
  }
}, {
  timestamps: true
});
busStopSchema.pre('save', async function(next) {
  if (!this.stopNo) {
    try {
      const stopSeq = await StopSequence.findOneAndUpdate(
        { name: 'busStop' },
        { $inc: { nextSequence: 1 } },
        { new: true, upsert: true }
      );
      const stopNumber = `S${stopSeq.nextSequence.toString().padStart(6, '0')}`;
      this.stopNo = stopNumber;  

      next();
    } catch (err) {
      console.error('Error generating stop number:', err);
      next(err); 
    }
  } else {
    next();
  }
});
const BusStop = mongoose.model('BusStop', busStopSchema);
module.exports = BusStop;
