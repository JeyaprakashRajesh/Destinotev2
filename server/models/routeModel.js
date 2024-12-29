const mongoose = require("mongoose");
const RouteSequence = require("./RouteSequence");

const routeSchema = new mongoose.Schema(
  {
    RouteNo: {
      type: String,
      required: true,
    },
    RouteId: {
      type: String,
      required: true,
    },
    busStops: {
      type: [String],
      required: true,
    },
    routeDistrict: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
routeSchema.pre("save", async function (next) {
  console.log("Pre-save hook triggered...");
  if (!this.RouteNo) {
    try {
      console.log("Generating RouteNo...");
      const routeSeq = await RouteSequence.findOneAndUpdate(
        { name: "routeNo" },
        { $inc: { nextSequence: 1 } },
        { new: true, upsert: true }
      );
      const routeNumber = `R${routeSeq.nextSequence.toString().padStart(6, "0")}`;
      this.RouteNo = routeNumber;
      console.log("Generated RouteNo:", this.RouteNo);
      next();
    } catch (err) {
      console.error("Error generating RouteNo:", err);
      next(err);
    }
  } else {
    console.log("RouteNo already exists:", this.RouteNo);
    next();
  }
});

const Route = mongoose.model("Route", routeSchema);
module.exports = Route;
