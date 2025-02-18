const User = require("../models/UserModel.js");
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



module.exports = {
  Login,
  Phone,
  getDetails
};
