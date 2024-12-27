const Route = require("../models/RouteModel");

const addRoute = async (req, res) => {
  const routeData = req.body; 
  console.log("Received Route Data:", routeData);

  try {
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
