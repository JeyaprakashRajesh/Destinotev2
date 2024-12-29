const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    VehicleNo: {
      type: String,
      required: true,
    },
    BusNo: {
      type: String,
      required: true,
    },
    RouteNo: {
      type: String,
      required: true,
    },
    DriverId: {
      type: String,
      required: true,
    },
    busCoordinates: {
      type: [Number],
      index: "2dsphere", // Geospatial index for coordinates
    },
    busSpeed: {
      type: Number,
    },
    busType: {
      type: String,
      required: true,
    },
    busDistrict: {
      type: String,
      required: true,
    },
    busStatus: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Export the Bus model, not BusStop
const Bus = mongoose.model("Bus", busSchema);
module.exports = Bus;  // Export Bus model instead of BusStop
