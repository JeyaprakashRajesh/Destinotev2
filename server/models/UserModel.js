const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  tempPhone: {
    type: Number,
  },
  phone: {
    type: Number,
    unique: true,
    sparse: true, // Allows tempPhone to exist without requiring phone
  },
  otp: {
    type: Number,
  },
  name: {
    type: String,
  },
  aadhar: {
    type: Number,
  },
  balance: {
    type: Number,
    default: 0,
  },
  transactionHistory: {
    type: [
      {
        balance: Number,
        transactionAmount: Number,
        operation: String,
        date : Date
      },
    ],
  },
  beneficieries: {
    type: [{ id: mongoose.Schema.ObjectId }],
  },
  travelHistory: {
    type: [
      {
        from: mongoose.Schema.ObjectId,
        to: mongoose.Schema.ObjectId,
        bus: mongoose.Schema.ObjectId,
        distance: Number,
        timeStamp: Date,
        fare: Number,
        status: String,
      },
    ],
  },
  yearlyTravel: {
    type: [
      {
        year: Number,
        data: [
          {
            month: Number,
            distance: Number,
          },
        ],
      },
    ],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
