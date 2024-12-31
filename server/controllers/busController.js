const Bus = require("../models/BusModel");

const addBus = async (req, res) => {
  const { VehicleNo, BusNo, RouteNo, DriverId, busType, busDistrict } =
    req.body;

  if (
    !VehicleNo ||
    !BusNo ||
    !RouteNo ||
    !Array.isArray(RouteNo) ||
    RouteNo.length === 0 ||
    !DriverId ||
    !busType ||
    !busDistrict
  ) {
    return res
      .status(400)
      .json({
        error: "All fields are required and RouteNo must be a non-empty array",
      });
  }

  try {
    const newBus = new Bus(req.body);
    await newBus.save();
    return res
      .status(201)
      .json({ message: "Bus added successfully", bus: newBus });
  } catch (err) {
    console.error("Error adding bus:", err.message);
    return res
      .status(500)
      .json({ error: "Failed to add bus", message: err.message });
  }
};

const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    return res.status(200).json(buses);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to fetch buses", message: err.message });
  }
};

const updateBusCoordinates = async (req, res) => {
  const { VehicleNo, coordinates } = req.body;

  if (
    !VehicleNo ||
    !coordinates ||
    !Array.isArray(coordinates) ||
    coordinates.length !== 2
  ) {
    return res
      .status(400)
      .json({ error: "VehicleNo and valid coordinates are required" });
  }

  try {
    const bus = await Bus.findOne({ VehicleNo });
    let previousCoordinates;
    if (bus.busCoordinates == undefined) {
      previousCoordinates = coordinates;
    } else {
      previousCoordinates = bus.busCoordinates;
    }
    const updatedBus = await Bus.findOneAndUpdate(
      { VehicleNo },
      { busCoordinates: coordinates, previousCoordinates: previousCoordinates },
      { new: true }
    );
    if (!updatedBus) {
      return res
        .status(404)
        .json({ error: "Bus not found with the provided VehicleNo" });
    }
    return res.status(200).json({
      message: "Bus coordinates updated successfully",
      bus: updatedBus,
    });
  } catch (err) {
    console.error("Error updating bus coordinates:", err.message);
    return res
      .status(500)
      .json({
        error: "Failed to update bus coordinates",
        message: err.message,
      });
  }
};

const updateBusDeparture = async (req, res) => {
  const { VehicleNo } = req.body;

  if (!VehicleNo) {
    return res.status(400).json({ error: "VehicleNo is required" });
  }

  try {
    const bus = await Bus.findOne({ VehicleNo });

    if (!bus) {
      return res
        .status(404)
        .json({ error: "Bus not found with the provided VehicleNo" });
    }

    const currentTime = new Date();
    if (bus.busType === "State Bus") {
      if (bus.currentRouteNo === undefined) {
        bus.currentRouteNo = 0;
      } else {
        bus.currentRouteNo = (bus.currentRouteNo + 1) % bus.RouteNo.length;
      }
    }

    const updatedBus = await Bus.findOneAndUpdate(
      { VehicleNo },
      {
        busDepartureTime: currentTime,
        busProgress: [
          {
            progress: 0,
            progressTime: currentTime,
          },
        ],
        currentRouteNo: bus.currentRouteNo,
      },
      { new: true }
    );

    return res.status(200).json({
      message:
        "Bus departure time updated and bus progress cleared successfully",
      bus: updatedBus,
    });
  } catch (err) {
    console.error(
      "Error updating bus departure time and progress:",
      err.message
    );
    return res
      .status(500)
      .json({
        error: "Failed to update bus departure time and progress",
        message: err.message,
      });
  }
};

const incrementBusProgress = async (req, res) => {
  const { VehicleNo } = req.body;

  if (!VehicleNo) {
    return res.status(400).json({ error: "VehicleNo is required" });
  }
  try {
    const currentTime = new Date();

    const bus = await Bus.findOne({ VehicleNo });
    if (!bus) {
      return res
        .status(404)
        .json({ error: "Bus not found with the provided VehicleNo" });
    }

    const lastProgress = bus.busProgress[bus.busProgress.length - 1] || {
      progress: 0,
    };
    const newProgressValue = lastProgress.progress + 1;

    bus.busProgress.push({
      progress: newProgressValue,
      progressTime: currentTime,
    });

    await bus.save();

    return res.status(200).json({
      message: "Bus progress incremented successfully",
      bus,
    });
  } catch (err) {
    console.error("Error incrementing bus progress:", err.message);
    return res
      .status(500)
      .json({
        error: "Failed to increment bus progress",
        message: err.message,
      });
  }
};

const getBusLocations = async () => {
  try {
    const buses = await Bus.find();
    return buses.map((bus) => ({
      VehicleNo: bus.VehicleNo,
      BusNo: bus.BusNo,
      busCoordinates: bus.busCoordinates,
      previousCoordinates: bus.previousCoordinates,
      busStatus: bus.busStatus,
      currentRouteNo: bus.currentRouteNo,
      busType: bus.busType,
      busDistrict: bus.busDistrict,
    }));
  } catch (err) {
    console.error("Error fetching bus locations:", err);
    return [];
  }
};

module.exports = {
  addBus,
  getAllBuses,
  updateBusCoordinates,
  updateBusDeparture,
  incrementBusProgress,
  getBusLocations,
};
