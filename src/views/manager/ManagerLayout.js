import React, { useEffect, useState } from "react";
import SideBar from "./../../component/managerViewComponents/SideBar";
import OrderPopup from "./../../component/managerViewComponents/OrderPopup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManagerLayout = ({ children }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupOrderId, setPopupOrderId] = useState(null);

  useEffect(() => {
    const handleMessage = (event) => {
      // FCM payload comes in event.data.data
      const { action, order_id, table_no } = event.data.data || {};
      if (action === "new_order") {
        // show toast
        toast.info(`📦 New Order #${order_id} from Table ${table_no}`, {
          position: "top-right",
          autoClose: 5000,
        });
        // show accept/reject popup
        setPopupOrderId(order_id);
        setShowPopup(true);
      }
    };

    navigator.serviceWorker?.ready.then(() => {
      navigator.serviceWorker.addEventListener("message", handleMessage);
    });

    return () => {
      navigator.serviceWorker?.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="manager-layout">
      <SideBar />
      <div className="manager-main-content">
        {children}
      </div>

      {/* mount the ToastContainer once */}
      {/* <ToastContainer position="top-right" autoClose={5000} /> */}

      {/* mount the popup once */}
      {showPopup && popupOrderId && (
        <OrderPopup
          orderId={popupOrderId}
          onClose={() => {
            setShowPopup(false);
            setPopupOrderId(null);
          }}
        />
      )}
    </div>
  );
};

export default ManagerLayout;
