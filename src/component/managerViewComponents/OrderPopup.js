import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const OrderPopup = ({ orderId, onClose }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    try {
      await axios.patch(`${apiUrl}order-status-update?flag=accepted`, {
        order_id: orderId,
      });
      toast.success(`Order ${orderId} accepted!`);
      onClose();
    } catch (error) {
      toast.error(`Failed to accept order ${orderId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    const confirm = window.confirm("Are you sure you want to reject this order?");
    if (!confirm) return;

    setLoading(true);
    try {
      await axios.patch(`${apiUrl}order-status-update?flag=rejected`, {
        order_id: orderId,
      });
      toast.success(`Order ${orderId} rejected!`);
      onClose();
    } catch (error) {
      toast.error(`Failed to reject order ${orderId}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-popup" role="dialog" aria-labelledby="order-dialog-title">
      <div className="order-popup-content">
        <h2 id="order-dialog-title">Order #{orderId}</h2>
        <p>Would you like to accept or reject this order?</p>
        <div className="order-popup-actions">
          <button onClick={handleAccept} className="accept-btn" disabled={loading}>
            {loading ? '...' : 'Accept'}
          </button>
          <button onClick={handleReject} className="reject-btn" disabled={loading}>
            {loading ? '...' : 'Reject'}
          </button>
        </div>
        <button onClick={onClose} className="close-btn" disabled={loading}>Close</button>
      </div>
    </div>
  );
};

export default OrderPopup;
