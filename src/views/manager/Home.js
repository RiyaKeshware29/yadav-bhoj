import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import OrderPopup from '../../component/managerViewComponents/OrderPopup'; // Import OrderPopup

const TOTAL_TABLES = 10;

const Dashboard = () => {
  const [tableData, setTableData] = useState([]);
  const [mostOrderedItem, setMostOrderedItem] = useState('');
  const [totalOrders, setTotalOrders] = useState(0);
  // eslint-disable-next-line
  const [notifications, setNotifications] = useState([]);
  // const [showPopup, setShowPopup] = useState(false);
  // const [popupOrderId, setPopupOrderId] = useState(null);

  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch table orders data
    const apiUrl = process.env.REACT_APP_API_URL;

    const fetchTableOrders = async () => {
      try {
        const response = await axios.get(`${apiUrl}get-table-order`);
        setTableData(response.data);
      } catch (error) {
        console.error("Error fetching table data:", error);
      }
    };

    

    // Fetch analytics (most ordered item, total orders)
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`${apiUrl}analytics`);
        setMostOrderedItem(response.data.mostOrderedItem);
        setTotalOrders(response.data.totalOrders);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchTableOrders();
    fetchAnalytics();
  }, []);


  // useEffect(() => {
  //   const handleMessage = (event) => {
  //     // console.log('[Dashboard] Message receivedddd:', event.data);
  //     const { order_id, action } = event.data.data || {};
  
  //     if (action === 'new_order') {
  //       setPopupOrderId(order_id);
  //       setShowPopup(true);
  //     }
  //   };
  
  //   navigator.serviceWorker?.ready.then(() => {
  //     navigator.serviceWorker.addEventListener('message', handleMessage);
  //   });
  
  //   return () => {
  //     navigator.serviceWorker?.removeEventListener('message', handleMessage);
  //   };
  // }, []);
  

  // Helper function to get table info by table number
  const getTableInfo = (tableNo) => {
    return tableData.find((t) => t.table_no === tableNo);
  };

  // Helper function to format ordered items
  const formatOrderedItems = (items) => {
    if (!Array.isArray(items) || items.length === 0) return "-";
    const grouped = items.reduce((acc, item) => {
      if (item?.name && typeof item.quantity === 'number') {
        acc[item.name] = (acc[item.name] || 0) + item.quantity;
      }
      return acc;
    }, {});
    return Object.entries(grouped)
      .map(([name, qty]) => `${name} (${qty})`)
      .join(', ');
  };

  // Render active tables dynamically
  const renderActiveTables = () => {
    return [...Array(TOTAL_TABLES)].map((_, i) => {
      const tableNo = i + 1;
      const info = getTableInfo(tableNo);

      if (info?.table_activity !== 'active' || info?.status === 'rejected') return null;

      return (
        <div
          className="table-card-wrap active"
          key={tableNo}
          onClick={() => navigate(`/m/tables`)} // Navigate to table details
          style={{ cursor: 'pointer' }}
        >
          <div className="table-details-1">
            <p><span className="table-card-heading">Table</span><span className="table-card-value">{tableNo}</span></p>
            <p><span className="table-card-heading">Status</span><span className="table-card-value">{info.status}</span></p>
            <p><span className="table-card-heading">Payment Status</span><span className="table-card-value">{info.payment_status}</span></p>
          </div>
          <p className="table-details-2">
            <span className="table-card-heading">Ordered Items</span>
            <span className="table-card-value">{formatOrderedItems(info.ordered_items)}</span>
          </p>
        </div>
      );
    });
  };

  // Show toast notifications for new orders (can be more dynamic)
  const showNewOrderNotification = () => {
    notifications.forEach((notification) => {
      console.log(`New order #${notification.order_id} from Table ${notification.table_no}`)
      // toast.info(`New order #${notification.order_id} from Table ${notification.table_no}`);
    });
  };

  useEffect(() => {
    if (notifications.length > 0) {
      showNewOrderNotification(); 
    }
     // eslint-disable-next-line
  }, [notifications]);

  return (
    <div className="dashboard-wrapper">
      <span className='dashboard-main-heading'>Dashboard</span>
      <div className="tabs">
        <div className="tab-btn active-tab">General Overview</div>
      </div>

      {/* Displaying Analytics */}
      <div className="dashboard-main-sub-heading">Analytics</div>
      <div className="dashboard-analytics-wrapper">
        <div
          className="most-ordered-item-card"
          onClick={() => navigate('/m/analytics')}
          style={{ cursor: 'pointer' }}
        >
          <div className="table-card-value">Most Ordered Item</div>
          <div className="dashboard-main-sub-heading">Today</div>
          <div className="most-ordered-item-name">{mostOrderedItem || '-'}</div>
        </div>

        <div
          className="total-order-card"
          onClick={() => navigate('/m/analytics')}
          style={{ cursor: 'pointer' }}
        >
          <div className="table-card-value">Total Orders</div>
          <div className="dashboard-main-sub-heading">Today</div>
          <div className="most-ordered-item-name">{totalOrders || 0}</div>
        </div>
      </div>

      {/* Displaying Active Tables */}
      <div className="dashboard-main-sub-heading">Active Tables</div>
      <div className="table-grid">
        {renderActiveTables()}
      </div>
      {/* {showPopup && popupOrderId && (
          <OrderPopup
            orderId={popupOrderId}
            onClose={() => {
              setShowPopup(false);
              setPopupOrderId(null);
            }}
          />
        )} */}

    </div>
  );
};

export default Dashboard;
