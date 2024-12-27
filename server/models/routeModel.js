const mongoose = require("mongoose");
const RouteSequence = require("./RouteSequence");  // Import the RouteSequence model

const routeSchema = new mongoose.Schema(
  {
    RouteNo: {
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

// Pre-save hook to auto-generate RouteNo
routeSchema.pre("save", async function (next) {
  if (!this.RouteNo) {
    try {
      // Fetch and update the RouteSequence model to get the next sequence
      const routeSeq = await RouteSequence.findOneAndUpdate(
        { name: "routeNo" },
        { $inc: { nextSequence: 1 } },
        { new: true, upsert: true }
      );
      
      // Format the RouteNo as R000001, R000002, etc.
      const routeNumber = `R${routeSeq.nextSequence.toString().padStart(6, "0")}`;
      this.RouteNo = routeNumber; // Set the RouteNo field

      next(); // Proceed with saving the route
    } catch (err) {
      console.error("Error generating RouteNo:", err);
      next(err); // Proceed with the error if any
    }
  } else {
    next();
  }
});

// Create and export the model
const Route = mongoose.model("Route", routeSchema);
module.exports = Route;
