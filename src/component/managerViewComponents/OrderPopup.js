import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const OrderPopup = ({ orderId, onClose }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  console.log(apiUrl)

  const [loadingAccept, setLoadingAccept] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);

  // Optional: ESC key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleAccept = async () => {
    const confirm = window.confirm("Are you sure you want to Accept this order?");
    if (!confirm) return;
  
    setLoadingAccept(true);
    try {
      await axios.patch(`${apiUrl}order-status-update?flag=accepted`, {
        order_id: orderId,
      });
      toast.success(`Order ${orderId} accepted!`);
    } catch (error) {
      toast.error(`Failed to accept order ${orderId}`);
    } finally {
      setLoadingAccept(false);
      onClose(); 
    }
  };
  

  const handleReject = async () => {
    const confirm = window.confirm("Are you sure you want to reject this order?");
    if (!confirm) return;
  
    setLoadingReject(true);
    try {
      await axios.patch(`${apiUrl}order-status-update?flag=rejected`, {
        order_id: orderId,
      });
      toast.success(`Order ${orderId} rejected!`);
    } catch (error) {
      toast.error(`Failed to reject order ${orderId}`);
    } finally {
      setLoadingReject(false);
      onClose(); // Always close, even if it fails
    }
  };
  

  return (
    <div className="order-popup" role="dialog" aria-labelledby="order-dialog-title">
      <div className="order-popup-content">
        <span id="order-dialog-title">New Order #{orderId}</span><br /><br />
        <p id="order-dialog-text">Would you like to accept or reject this order?</p>
        <div className="order-popup-actions">
          <button
            onClick={handleAccept}
            className="accept-btn option available"
            disabled={loadingAccept || loadingReject}
          >
            {loadingAccept ? 'Processing..' : 'Accept'}
          </button>
          <button
            onClick={handleReject}
            className="reject-btn option unavailable"
            disabled={loadingAccept || loadingReject}
          >
            {loadingReject ? 'Processing..' : 'Reject'}
          </button>
        </div>
        <button
          onClick={onClose}
          className="close-btn"
          disabled={loadingAccept || loadingReject}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default OrderPopup;
