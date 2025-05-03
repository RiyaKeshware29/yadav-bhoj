import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Analytics = () => {
  const [mostOrderedItem, setMostOrderedItem] = useState('');
  const [totalOrders, setTotalOrders] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null);
  const [AOV, setAOV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${apiUrl}analytics`);
        setMostOrderedItem(data.mostOrderedItem);
        setTotalOrders(data.totalOrders);
        setTotalUsers(data.totalUsers);
        setAOV(data.aov);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <span className="dashboard-main-heading">Analytics</span>
        <p>Loading stats…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-wrapper">
        <span className="dashboard-main-heading">Analytics</span>
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <span className="dashboard-main-heading">Analytics</span>
      <div className="tabs">
        <div className="tab-btn active-tab">Restaurant Stats</div>
      </div>

      <div className="dashboard-analytics-wrapper">
        <div className="most-ordered-item-card" style={{ cursor: 'pointer' }}>
          <div className="table-card-value">Most Ordered Item</div>
          <div className="dashboard-main-sub-heading">Today</div>
          <div className="most-ordered-item-name">{mostOrderedItem || '-'}</div>
        </div>

        <div className="total-order-card" style={{ cursor: 'pointer' }}>
          <div className="table-card-value">Total Orders</div>
          <div className="dashboard-main-sub-heading">Today</div>
          <div className="most-ordered-item-name">
            {totalOrders !== null ? totalOrders : '-'}
          </div>
        </div>

        <div className="total-order-card" style={{ cursor: 'pointer' }}>
          <div className="table-card-value">Total Users</div>
          <div className="dashboard-main-sub-heading">Till Now</div>
          <div className="most-ordered-item-name">
            {totalUsers !== null ? totalUsers : '-'}
          </div>
        </div>

        <div className="total-order-card" style={{ cursor: 'pointer' }}>
          <div className="table-card-value">Average Order Value</div>
          <div className="dashboard-main-sub-heading">Today</div>
          <div className="most-ordered-item-name">
            {AOV !== null ? AOV : '-'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
