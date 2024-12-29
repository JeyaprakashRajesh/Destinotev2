const Route = require("../models/routeModel");
const RouteSequence = require("../models/RouteSequence");

const addRoute = async (req, res) => {
  const routeData = req.body; 
  console.log("Received Route Data:", routeData);

  try {
    // Generate the next RouteNo
    const routeSeq = await RouteSequence.findOneAndUpdate(
      { name: "busRoute" },
      { $inc: { nextSequence: 1 } },
      { new: true, upsert: true }
    );

    if (!routeSeq) {
      throw new Error("Failed to generate route number sequence.");
    }

    const routeNumber = `R${routeSeq.nextSequence.toString().padStart(6, "0")}`;
    routeData.RouteNo = routeNumber; // Assign generated RouteNo to routeData

    const newRoute = new Route(routeData);

    await newRoute.save();

    res.status(201).json({ message: "Route added successfully", route: newRoute });
  } catch (err) {
    console.error("Error adding route:", err.message);
    res.status(400).json({ error: "Failed to add route", message: err.message });
  }
};

const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.status(200).json(routes);
  } catch (err) {
    res.status(400).json({ error: "Failed to fetch routes", message: err.message });
  }
};

module.exports = {
  addRoute,
  getAllRoutes,
};
