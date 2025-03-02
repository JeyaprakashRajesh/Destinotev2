import React, { useState } from "react";
import { ChevronLeft } from "lucide-react"
import { BACKEND_URL } from "../../utils/routes";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isPhone, setIsPhone] = useState(true);
  const navigate = useNavigate();

  async function handleGetOtp() {
    if (phone.length !== 10) {
      alert("Invalid Phone Number", "Please enter a valid 10-digit phone number.");
      return;
    }

    try {

      const response = await axios.post(`${BACKEND_URL}/api/user/phone`, { phone });

      if (response.status === 200) {
       setIsPhone(false);
      } else {
        alert("Error", "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Network Error", "Could not connect to server. Please check your connection.");
    }
  }
  async function handleOtpSubmit() {
    console.log(otp)
    if (!otp || otp.length !== 6) {
      alert("Invalid OTP", "OTP must be 6 digits.");
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/user/login`, {
        phone, 
        otp,
      });

      const { token, message } = response.data;
      localStorage.setItem("token", token); 
      console.log(message)
      navigate("/home");

    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="w-screen h-screen  bg-primary flex items-center justify-center ">
      <div className="h-120 w-300 bg-white rounded-2xl flex flex-row items-center justify-center">
        <div className="w-1/2 h-full flex flex-col justify-center pl-8">
          <div className="text-4xl font-medium text-secondary mb-4">
            Login to Destinote
          </div>
          <div className="text-lg">
            {isPhone ? "Login to Destinote with your phone number" : "Enter the One-Time Password to Continue"}
          </div>
        </div>
        { isPhone ? <div className="w-1/2 h-full flex flex-col items-center justify-center bg-cyan-50 rounded-2xl">
          <div className="text-3xl text-secondary mb-10">
            Enter Your Phone Number
          </div>
          <div className="w-full flex items-center justify-center mb-10">
            <input 
              type="number" 
              onChange={(e) => setPhone(e.target.value)}
              value={phone} 
              className="border-4 border-primary flex items-center justify-center font-medium pl-4 pr-4 pt-4 pb-4 text-lg  appearance-none tracking-widest outline-0 rounded-xl w-6/10"           
              placeholder="phone"
            />
          </div>
          <div className="w-full flex items-center justify-center">
            <div className="border-4 border-primary bg-primary text-white flex items-center justify-center font-medium pl-4 pr-4 pt-2 pb-3 text-lg  appearance-none  outline-0 rounded-xl w-6/10 cursor-pointer hover:scale-103 transition-all" onClick={() => handleGetOtp()}>
              GetOtp
            </div>
          </div>
        </div> : 
          <div className="w-1/2 h-full flex flex-col items-center justify-center bg-cyan-50 rounded-2xl relative" >
            <div className="absolute top-10 left-4 flex flex-row items-center text-lg cursor-pointer" onClick={() => setIsPhone(true)}>
              <ChevronLeft className="cursor-pointer h-10 w-10" color="var(--color-secondary)"  />
              <div>
              Back
            </div>
            </div>
            
          <div className="text-3xl text-secondary mb-10">
            Enter the One-Time Password
          </div>
          <div className="w-full flex items-center justify-center mb-10">
            <input 
              type="number" 
              onChange={(e) => setOtp(e.target.value)}
              value={otp} 
              className="border-4 border-primary flex items-center justify-center font-medium pl-4 pr-4 pt-4 pb-4 text-lg  appearance-none tracking-widest outline-0 rounded-xl w-6/10"           
              placeholder="otp"
            />
          </div>
          <div className="w-full flex items-center justify-center">
            <div className="border-4 border-primary bg-primary text-white flex items-center justify-center font-medium pl-4 pr-4 pt-2 pb-3 text-lg  appearance-none  outline-0 rounded-xl w-6/10 cursor-pointer hover:scale-103 transition-all" onClick={() => handleOtpSubmit()}>
              Login
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  );
}