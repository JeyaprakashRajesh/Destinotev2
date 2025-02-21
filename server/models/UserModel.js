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
      Object
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
