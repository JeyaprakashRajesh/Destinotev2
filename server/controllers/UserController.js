const User = require("../models/UserModel.js");
const Bus = require("../models/BusModel");
const BusStop = require('../models/busStopModel');

const {generateToken} = require("../config/jwt.js")
const asyncHandler = require("express-async-handler");

async function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000); 
}

async function Phone(req, res) {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    let user = await User.findOne({ $or: [{ phone }, { tempPhone: phone }] });

    const otp = await generateOTP();

    if (user) {
      user.otp = otp;
    } else {
      user = new User({ tempPhone: phone, otp });
    }

    await user.save();

    console.log(`OTP sent to ${phone}: ${otp}`);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}


const Login = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;
  

  if (!phone || !otp) {
    return res.status(400).json({ message: "Phone and OTP are required" });
  }
  
  const user = await User.findOne({ $or: [{ phone }, { tempPhone: phone }] });
  console.log(phone , otp , user.otp)
  if (!user || user.otp !== parseInt(otp)) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
  
  if (user.tempPhone) {
    user.phone = user.tempPhone;
    user.tempPhone = undefined;
  }

  user.otp = undefined; 
  await user.save();

  const token = generateToken(user.phone);

  return res.status(200).json({ message: "Login successful", token });
});

async function getDetails(req, res) {
  try {
    const phone = req.decoded_data.phone;
    const user = await User.findOne({ phone: phone });

    if (user) {
      const userObject = user.toObject(); 
      res.status(200).json({ data: userObject });
    } else {
      res.status(500).json({ message: "No data found in the DB" });
    }
  } catch (err) {
    console.log("Error while fetching userdata:", err);
    res.status(500).json({ message: "Error while fetching data" });
  }
}

async function Recharge(req, res) {
  try {
    console.log("Recharge initiated");

    const amount = Number(req.body.amount); 
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const phone = req.decoded_data.phone;
    const user = await User.findOne({ phone: phone });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.balance = Number(user.balance) + amount;

    // Add transaction history
    user.transactionHistory.push({
      balance: user.balance,
      transactionAmount: amount,
      operation: "credit",
      date: new Date(),
    });

    await user.save();

    console.log("User after recharge:", user);

    res.status(200).json({ message: "Amount recharged successfully", user : user });
  } catch (err) {
    console.error("Recharge error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function QrCode(req, res) {
  try {
    const phone = req.decoded_data.phone;
    
    const data = req.body.data || req.body;  
    
    if (data.payload.vechicle) {
      data.payload.vehicle = data.payload.vechicle;
      delete data.payload.vechicle;
    }
    const user = await User.findOne({ phone: phone });
    const bus = await Bus.findOne({ VehicleNo: data.payload.vehicle });
    const fromStop = await BusStop.findOne({ stopNo: data.payload.from });
    const toStop = await BusStop.findOne({ stopNo: data.payload.to });
    console.log("Data:", data);
    console.log("User:", user);
    console.log("Bus:", bus);
    console.log("From Stop:", fromStop);
    console.log("To Stop:", toStop);


    if (!user || !bus || !fromStop || !toStop) {
      return res.status(404).json({ message: "Unable to Fetch Data" });
    }

    if (user.balance < data.payload.amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }
    user.balance -= data.payload.amount;

    user.travelHistory.push({ ...data.payload , date: new Date() });
    user.transactionHistory.push({
      balance: user.balance,
      transactionAmount: data.payload.amount,
      operation: "debit",
      date: new Date(),
    });

    await user.save();
    res.status(200).json({
      message: "Amount deducted successfully",
      user: user,
      bus: bus,
      fromStop: fromStop,
      toStop: toStop,
    });
  } catch (err) {
    console.error("Recharge error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}





module.exports = {
  Login,
  Phone,
  getDetails,
  Recharge,
  QrCode
};
