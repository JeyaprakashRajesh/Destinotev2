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
      required: true,
      index: "2dsphere",
    },
    busSpeed: {
      type: Number,
      required: true,
    },
    busType: {
      type: String,
      required: true,
    },
    busDistrict : {
        type: String,
        required: true,
    },
    busStatus: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Bus = mongoose.model("Bus", busSchema);
module.exports = BusStop;
