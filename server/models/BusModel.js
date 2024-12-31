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
      type: [String],
      required: true,
    },
    currentRouteNo : {
      type: Number,
    },
    DriverId: {
      type: String,
      required: true,
    },
    busCoordinates: {
      type: [Number],
      index: "2dsphere",
    },
    previousCoordinates: {
      type: [Number],
      index: "2dsphere",
    },
    busSpeed: {
      type: Number,
    },
    busDepartureTime : {
      type: Date
    },
    busProgress : {
      type: [{
        progress: {type: Number},
        progressTime: {type: Date}
      }]
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
    timestamps: true,
  }
);

const Bus = mongoose.model("Bus", busSchema);
module.exports = Bus; 
