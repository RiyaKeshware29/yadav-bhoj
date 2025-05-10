import React from "react";
import { useNavigate } from 'react-router-dom';  // Import useNavigate for page navigation
import Button from './CustomButton';
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

const RazorpayPayment = ({ order, onSuccess }) => {
  const navigate = useNavigate();  // Initialize the navigate function
  const apiUrl = process.env.REACT_APP_API_URL;

  const handlePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      // alert("Razorpay SDK failed to load.");          
      toast.error("Razorpay SDK failed to load.");

      return;
    }

    const options = {
      key: "rzp_test_jN1QM98179txvH",
      amount: order.total_price * 100,
      currency: "INR",
      name: "यादव भोज",
      description: `Payment for Order #${order.order_id}`,
      handler: async function (response) {
        // alert(`Payment successful. Payment ID: ${response.razorpay_payment_id}`);
        toast.success(`Payment successful. Payment ID: ${response.razorpay_payment_id}`);
        try {
          const res = await fetch(`${apiUrl}order-payment/${order.order_id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              payment_status: 'paid',
            }),
          });

          if (res.ok) {
            // Navigate to payment success page if update was successful
            navigate('/u/payment-status/success');
          } else {
            // Navigate to payment failed page if something went wrong in backend
            navigate('/u/payment-status/failed');
          }

          if (onSuccess) onSuccess();
        } catch (error) {
          console.error("Payment update error:", error);
          navigate('/u/payment-status/failed');  // Handle network or server errors
        }
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#F97316",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      // alert(`Payment failed: ${response.error.description}`);
      toast.error(`Payment failed: ${response.error.description}`);

      navigate('/u/payment-status/failed');  // Navigate to payment failed page if payment fails
    });
    rzp.open();
  };

  return (
    <Button text={"Pay Bill"} width="49%" onClick={handlePayment}/>
  );
};

export default RazorpayPayment;
