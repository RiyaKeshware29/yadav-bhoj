import React, { useState } from "react";
import { useUser } from '../../../context/UserContext';
import { auth } from "../../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Button from '../../../component/CustomButton';
import UserComponent from '../../../component/UserComponent';
import PhoneInput1 from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'; 
import { toast } from "react-toastify";

const PhoneInput = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { updateUser } = useUser();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false); // loader state
  const navigate = useNavigate();

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {
          console.log("reCAPTCHA solved ✅");
        },
        "expired-callback": () => {
          console.log("reCAPTCHA expired ❌");
        },
      });
    }
  };

  const sendOTP = async () => {
    if (!phone || !phone.startsWith("+")) {
      alert("Enter phone number in international format, e.g., +91xxxxxxxxxx");
      return;
    }
  
    setLoading(true);
  
    try {
      // Step 1: Check if user exists
      console.log(`${apiUrl}check-user/${phone}`);
      const checkRes = await fetch(`${apiUrl}check-user/${phone}`, {
        method: "GET",
      });
  
      const checkData = await checkRes.json();
      console.log("Check Data:", checkData); // Debugging log here
  
      if (checkData.exist) {
        // alert("✅You're Existing user!");
        toast.success('You are existing user!✅');

        console.log("Existing user UID:", checkData.uid); // Log UID here
        // Update context with the UID from the API (checkData.uid)
        updateUser({ phone, uid: checkData.uid, isVerified: true });
        navigate("/u/select-table");
        return;
      }
  
      // Step 2: Setup OTP flow for new user
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      // alert("OTP sent ✅");        
      toast.success('OTP sent✅');

      window.confirmationResult = confirmation;
      updateUser({ phone });
      navigate("/u/verify-otp");
    } catch (error) {
      toast.error('❌ Something went wrong. Try again.!');
      // alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <UserComponent title="Please enter your phone number" subtitle="We will send you a one time password on this number" step={1}>
      <br />
      <span>Your phone number</span>
      <PhoneInput1
        country={'in'}
        onlyCountries={['in']}
        value={phone}
        onChange={(phone) => setPhone(`+${phone}`)}
        inputClass="input"
      />
      <Button width="90%" text={loading ? <div className="loader" /> : "Send OTP"} onClick={sendOTP} disabled={loading} />
      <div id="recaptcha-container"></div>
    </UserComponent>
  );
};

export default PhoneInput;
