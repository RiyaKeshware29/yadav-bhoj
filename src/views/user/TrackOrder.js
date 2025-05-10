import React, { useEffect, useState } from 'react'; 
import { useNavigate, useParams } from 'react-router-dom';
import FooterMenu from '../../component/FooterMenu';
import Button from '../../component/CustomButton';
import Logo from '../../component/Logo';
import VerticalStepTracker from '../../component/VerticalStepTracker';
import { useUser } from '../../context/UserContext';

const TrackOrder = () => {
  const { user } = useUser();
  const { order_id } = useParams();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [orderItems, setOrderItems] = useState([]);
  const navigate = useNavigate();

  const handleGoToPayment = () => {
    navigate(`/u/order-history`);
  };

  const handleGoToMenu = () => {
    navigate(`/u/menu`);
  };

  useEffect(() => {
    if (!order_id) return;

    const fetchOrderDetails = async () => {
      try {
        const res = await fetch(`${apiUrl}get-order/${order_id}`);
        const data = await res.json();
        setOrderItems(data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
    const interval = setInterval(() => {
      fetchOrderDetails();
    }, 10000);

    return () => clearInterval(interval);
  }, [order_id, apiUrl]);

  const allItemsServed = orderItems.length > 0 &&
    orderItems.every(item => item.order_status === 'served' || item.order_status === 'rejected');

  return (
    <div className="track-order-page">
      <div className="track-order-wrapper">
        <div className="search-bar-section">
          <Logo />
          <div className="cart-head">
            <h2>Order Status</h2>
            <p className="subheading">Track order progress</p>
          </div>
        </div>
        <div className="subheading" style={{marginLeft:'10px'}}>You're seated in : Table No. - {user.tableNumber}</div>
        {orderItems.length === 0 ? (
          <p className="center-text">Loading or no items found.</p>
        ) : (
          <div className="order-items-list">
            {orderItems.map((item, index) => (
              <div key={index} className="track-item-card">
                <h4>{item.item_name}</h4>
                <p>Quantity: {item.quantity}</p>
                {item.order_status === "rejected" ? (
                  <p className="rejected-status">Item Rejected</p>
                ) : (
                  <VerticalStepTracker currentStatus={item.order_status} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {allItemsServed && (
        <div className="track-page-part2">
          <div className="cart-head">
            <h4>Your order was served!</h4>
            <span className="subheading" onClick={handleGoToPayment}>
              💰 Complete order & pay
            </span>
          </div>
          <Button text={'Still Hungry?'} onClick={handleGoToMenu} width="45%" />
        </div>
      )}
      <FooterMenu />
    </div>
  );
};

export default TrackOrder;
