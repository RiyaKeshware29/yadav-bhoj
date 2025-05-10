import React from "react";
import { toast, ToastContainer } from 'react-toastify';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PaymentButton = () => {
    const handlePayment = async () => {
        const res = await loadRazorpayScript();
        if (!res) {
          toast.error("Razorpay SDK failed to load. Are you online?");
          // alert("Razorpay SDK failed to load. Are you online?");
          return;
        }
      
        const options = {
          key: "rzp_test_jN1QM98179txvH",
          amount: 50000,
          currency: "INR",
          name: "NurtureHub",
          description: "Test Transaction",
          image: "https://yourlogo.png",
          handler: function (response) {
            toast.success(`Payment successful. Payment ID: ${response.razorpay_payment_id}`);
            // alert(`Payment successful. Payment ID: ${response.razorpay_payment_id}`);
            console.log("Payment Successful:", response);
          },
          prefill: {
            name: "Test User",
            email: "test@example.com",
            contact: "9999999999",
          },
          notes: {
            address: "NurtureHub Test Address",
          },
          theme: {
            color: "#3399cc",
          },
        };
      
        const rzp = new window.Razorpay(options);
      
        // 👉 Handle payment failure
        rzp.on('payment.failed', function (response) {
          toast.error(`Payment failed: ${response.error.description}`);
          // alert(`Payment failed: ${response.error.description}`);
          console.error("Payment Failed:", response.error);
        });
      
        rzp.open();
      };
      
      

  return <button onClick={handlePayment}>Pay ₹500</button>;
};

export default PaymentButton;
