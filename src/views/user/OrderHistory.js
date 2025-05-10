import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../../component/Logo';
import Button from '../../component/CustomButton';
import Button2 from '../../component/BorderButton';
import FooterMenu from '../../component/FooterMenu';
import RazorpayPayment from '../../component/RazorpayPayment';
import { useUser } from '../../context/UserContext';

const OrderHistory = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const highlightOrderId = location.state?.highlightOrderId;
  const highlightRef = useRef(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${apiUrl}order/${user.uid}`);
        const data = await res.json();
        setOrders(groupOrders(data));
      } catch (err) {
        console.error("Error fetching order history:", err);
      }
    };

    if (user && user.uid) {
      fetchOrders();
    }
  }, [apiUrl, user]);

  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [orders]);

  const groupOrders = (data) => {
    const grouped = {};
  
    data.forEach(item => {
      if (!grouped[item.order_id]) {
        grouped[item.order_id] = {
          order_id: item.order_id,
          table_no: item.table_no,
          total_price: parseFloat(item.total_price),
          payment_status: item.payment_status,
          status: item.order_status,
          date_time: item.date_time,
          items: [],
        };
      }
  
      grouped[item.order_id].items.push({
        item_id: item.item_id,
        item_name: item.item_name,
        item_price: parseFloat(item.item_price),
        quantity: item.quantity,
        item_status: item.order_status,
      });
    });
  
    // Convert to array and sort by date_time descending
    return Object.values(grouped).sort((a, b) => new Date(b.date_time) - new Date(a.date_time));
  };
  

  const formatDateTime = (datetimeStr) => {
    const date = new Date(datetimeStr);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    return `${time}, ${dateStr}`;
  };

  const handleReorder = (items) => {
    navigate("/u/menu", { state: { reorderItems: items } });
  };

  const handleTrackOrder = (order_id) => {
    navigate(`/u/track-order/${order_id}`);
  };

  const ongoing = orders.filter(order =>
    order.status !== 'done' ||
    order.payment_status !== 'paid' ||
    order.items.some(item => item.item_status !== 'served' && item.item_status !== 'rejected')
  );

  const past = orders.filter(order =>
    order.payment_status === 'paid' &&
    order.items.every(item => item.item_status === 'served' || item.item_status === 'rejected')
  );  

  return (
    <div className="order-history-page">
      <div className="search-bar-section">
        <Logo />
        <div className="cart-head">
          <h2>Order history</h2>
          <p className="subheading">All you've ordered yet.</p>
        </div>
      </div>
      <div className="subheading" style={{marginLeft:'10px'}}>You're seated in : Table No. - {user.tableNumber}</div>

      {/* COMPLETED BUT UNPAID */}
      {ongoing
        .filter(order =>
          order.payment_status !== 'paid' &&
          order.items.every(item => item.item_status === 'served')
        )
        .map((order, idx) => (
          <div className="order-card ongoing" key={idx}>
            <div className="order-head">
              <div className="order-row">
                <span className='heading'>Time</span>
                <span>{formatDateTime(order.date_time)}</span>
              </div>
              <div className="order-row">
                <span className='heading'>Table</span>
                <span>{order.table_no}</span>
              </div>
            </div>

            <div className="order-items-grid">
              <div className="order-grid-header">
                <span>Items</span>
                <span>Qty</span>
                <span>Price</span>
              </div>
              {order.items.map((item, i) => (
                <div className="order-grid-row served-item" key={i}>
                  <span>{item.item_name}</span>
                  <span>{item.quantity}</span>
                  <span>Rs. {item.item_price.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="order-total">
              <span>Total amount <small>(incl. taxes)</small></span>
              <span className="amount">Rs. {order.total_price.toLocaleString()}</span>
            </div>

            <div className="order-actions">
              <RazorpayPayment
                order={order}
                onSuccess={() => {
                  setTimeout(() => {
                    fetch(`${apiUrl}order/${user.uid}`)
                      .then(res => res.json())
                      .then(data => setOrders(groupOrders(data)));
                  }, 1000);
                }}
              />
            </div>
          </div>
        ))}

      {/* ONGOING ORDERS - NOT FULLY SERVED */}
      {ongoing
        .filter(order =>
          order.items.some(item => item.item_status !== 'served' && item.item_status !== 'rejected')
        )
        .map((order, idx) => (
          <div
            className={`order-card ongoing ${order.order_id === highlightOrderId ? 'highlighted-order' : ''}`}
            key={idx}
            ref={order.order_id === highlightOrderId ? highlightRef : null}
          >
            <div className="order-head">
              <div className="order-row">
                <span className='heading'>Time</span>
                <span>{formatDateTime(order.date_time)}</span>
              </div>
              <div className="order-row">
                <span className='heading'>Table</span>
                <span>{order.table_no}</span>
              </div>
            </div>

            <div className="order-items-grid">
              <div className="order-grid-header">
                <span>Items</span>
                <span>Qty</span>
                <span>Price</span>
              </div>
              {order.items.map((item, i) => (
                <div className={`order-grid-row ${item.item_status === 'served' ? 'served-item' : ''}`} key={i}>
                  <span>
                    {item.item_name} ({item.item_status})
                  </span>
                  <span>{item.quantity}</span>
                  <span>Rs. {item.item_price.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="order-total">
              <span>Total amount <small>(incl. taxes)</small></span>
              <span className="amount">Rs. {order.total_price.toLocaleString()}</span>
            </div>

            <div className="order-actions">
              <Button
                width='49%'
                text="Track Order"
                onClick={() => handleTrackOrder(order.order_id)}
              />
            </div>
          </div>
        ))}

      {/* PAST ORDERS */}
      {past.length > 0 && (
        <div className='past-order-container'>
          <p className='order-subheading'>Past orders</p>
          {past.map((order, idx) => (
            <div className="order-card past" key={idx}>
              <div className="order-head">
                <div className="order-row">
                  <span><strong>Time</strong></span>
                  <span>{formatDateTime(order.date_time)}</span>
                </div>
                <div className="order-row">
                  <span><strong>Amount</strong></span>
                  <span>Rs. {order.total_price.toLocaleString()}</span>
                </div>
              </div>
              <div className="order-items">
                {order.items.map((item, i) => (
                  <p key={i}>
                    {item.item_name} ({item.quantity})
                  </p>
                ))}
              </div>
              <div className="reorder-btn">
                <Button2 width='50%' onClick={() => handleReorder(order.items)} text={'Reorder'} />
              </div>
            </div>
          ))}
        </div>
      )}

      <FooterMenu />
    </div>
  );
};

export default OrderHistory;
