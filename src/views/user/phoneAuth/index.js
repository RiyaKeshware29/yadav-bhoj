import React, { useState } from "react";
import PhoneInput from "./PhoneInput";
import OTPVerification from "./OTPVerification";

const PhoneAuth = () => {
  const [step, setStep] = useState("phone"); // 'phone' or 'otp'
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <>
      {step === "phone" ? (
        <PhoneInput
          onSuccess={(phone) => {
            setPhoneNumber(phone);
            setStep("otp");
          }}
        />
      ) : (
        <OTPVerification phoneNumber={phoneNumber} />
      )}

    </>
  );
};

export default PhoneAuth;
