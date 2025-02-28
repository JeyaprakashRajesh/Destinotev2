import React, { useState } from "react";

export default function Auth() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isPhone, setIsPhone] = useState(true);

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phone.length === 10) {
      console.log("Sending OTP to:", phone);
      setIsPhone(false);
    } else {
      alert("Please enter a valid 10-digit phone number");
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      console.log("Verifying OTP:", otp);
      alert("OTP Verified Successfully!");
    } else {
      alert("Please enter a valid 6-digit OTP");
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhone(value);
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setOtp(value);
  };

  return (
    <section className="h-screen w-screen bg-blue-200 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {isPhone ? (
          <div>
            <form onSubmit={handlePhoneSubmit}>
              <div className="mb-4 text-lg font-semibold">Get Started With Phone</div>
              <div>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={handlePhoneChange}
                  className="border p-2 rounded w-full"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="mt-4">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Send OTP
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <form onSubmit={handleOtpSubmit}>
              <div className="flex items-center mb-4">
                <button onClick={() => setIsPhone(true)} className="mr-2 text-blue-500">
                  ← Back
                </button>
                <span className="text-lg font-semibold">Enter the OTP</span>
              </div>
              <div>
                <input
                  type="number"
                  maxLength={6}
                  value={otp}
                  onChange={handleOtpChange}
                  className="border p-2 rounded w-full"
                  placeholder="Enter OTP"
                />
              </div>
              <div className="mt-4">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                  Submit OTP
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}