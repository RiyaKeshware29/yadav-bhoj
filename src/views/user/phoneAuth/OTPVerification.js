import React, { useState, useEffect, useRef } from "react";
import { useUser } from '../../../context/UserContext';
import { useNavigate } from "react-router-dom";
import Button from '../../../component/CustomButton';
import UserComponent from '../../../component/UserComponent';
import { toast } from "react-toastify";

const OTPVerification = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { user, updateUser } = useUser(); // use context
  const [loading, setLoading] = useState(false); // loader state
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.confirmationResult) {
      alert("No OTP request found. Please enter phone number first.");
      navigate("/u/phone");
    }
  }, [navigate]);

  const handleChange = (index, value) => {
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otpDigits];
      newOtp[index] = value;
      setOtpDigits(newOtp);

      // Auto-focus next input
      if (index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    } else if (value === "") {
      const newOtp = [...otpDigits];
      newOtp[index] = "";
      setOtpDigits(newOtp);
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
    const otp = otpDigits.join("");
    const confirmationResult = window.confirmationResult;

    try {
      const result = await confirmationResult.confirm(otp);
      const fb_uid = result.user.uid;
      const phone_no = user.phone;

      const formData = new FormData();
      formData.append("phone_no", phone_no);
      formData.append("fb_uid", fb_uid);

      const res = await fetch(`${apiUrl}user`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data.uid);
        console.log("✅ UID created in DB");

        updateUser({
          uid: data.uid,
          isVerified: true,
        });
        toast.success('You are Logged In successfully!✅');
        // alert("✅ UID created in DB");
        navigate("/u/select-table");
      } else {
        console.error("❌ Failed to create UID in backend");
        toast.error('Failed to Logged In!');

        // alert("Something went wrong while storing user. Try again.");
      }
    } catch (err) {
      console.error("❌ Invalid OTP", err);
      toast.error('❌ Invalid OTP!');

      // alert("Incorrect OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserComponent title="Please enter the OTP" subtitle="You’re almost there!" step={2}>
          <div className="otp-input-container">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => (inputsRef.current[index] = el)}
                className="otp-box"
                autoFocus={index === 0}
              />
            ))}
          </div>
          <Button width="100%" text={loading ? <div className="loader" /> : "Next"} onClick={verifyOTP} />
   </UserComponent>
  );
};

export default OTPVerification;
