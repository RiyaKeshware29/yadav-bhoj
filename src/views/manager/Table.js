import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Button from '../../component/CustomButton';

const TOTAL_TABLES = 10;

const Table = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [tableData, setTableData] = useState([]);
  const [activeTab, setActiveTab] = useState('total');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [orderedItemsStatus, setOrderedItemsStatus] = useState([]);

  useEffect(() => {
    const fetchTableOrders = async () => {
      try {
        const response = await axios.get(`${apiUrl}get-table-order`);
        setTableData(response.data);
      } catch (error) {
        console.error("Error fetching table data:", error);
        toast.error('Failed to fetch table data');
      }
    };

    fetchTableOrders();
     // eslint-disable-next-line
  }, []);

  const getTableInfo = (tableNo) => {
    return tableData.find((t) => t.table_no === tableNo);
  };

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

  const handleTableClick = (tableInfo) => {
    setSelectedTable(tableInfo);
    console.log("Selected Table:", tableInfo);
  
    const updatedOrderedItems = tableInfo?.ordered_items?.map(item => {
      return {
        ...item,
        status: item.order_status || 'pending',
      };
    }) || [];
  
    setOrderedItemsStatus(updatedOrderedItems);
    setShowModal(true);
  };

  const handleStatusChange = (index, newStatus) => {
    const updatedItems = [...orderedItemsStatus];
    updatedItems[index].status = newStatus;
    setOrderedItemsStatus(updatedItems);
  };

  const handleSave = async () => {
    if (!selectedTable?.last_order_id) { 
      console.error("Missing order_id");
      toast.error('Missing order ID');
      return;
    }
  
    try {
      // Update the status for each item
      await Promise.all(orderedItemsStatus.map(async (updatedItem) => {
        if (!updatedItem?.item_id) {
          console.error("Missing item_id");
          toast.error('Missing item ID');
          return;
        }
  
        await axios.patch(`${apiUrl}update-item-status`, {
          order_id: selectedTable.last_order_id,  
          item_status: updatedItem.status,
          item_id: updatedItem.item_id,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }));
  
      // Re-fetch the table data to update UI with the latest status
      const response = await axios.get(`${apiUrl}get-table-order`);
      setTableData(response.data);
  
      toast.success('Order status updated successfully!');
      setShowModal(false); // Close modal after saving
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };
  

  const renderTables = () => {
    return [...Array(TOTAL_TABLES)].map((_, i) => {
      const tableNo = i + 1;
      const info = getTableInfo(tableNo);
      if (activeTab === 'active' && info?.table_activity !== 'active') return null;
      
      const hasRejectedItems = info?.ordered_items?.some(item => item.order_status === 'rejected');
      
      const handleClick = hasRejectedItems ? null : () => info?.table_activity === 'active' && handleTableClick(info);
  
      return (
        <div
          className={`table-card-wrap ${info?.table_activity === 'active' ? 'active' : ''} ${hasRejectedItems ? 'reject' : ''}`}
          key={tableNo}
          onClick={handleClick}
        >
          <div className="table-details-1" style={{justifyContent:'space-between',alignContent:'start'}}>
            <p><span className="table-card-heading">Order ID</span><span className="table-card-value">{info ? info.last_order_id : "-"}</span></p>
            <p><span className="table-card-heading">Date</span><span className="table-card-value">{info ? info.date_time : "-"}</span></p>
          </div>
          <div className="table-details-1">
            <p><span className="table-card-heading">Table</span><span className="table-card-value">{tableNo}</span></p>
            <p><span className="table-card-heading">Status</span><span className="table-card-value">{info ? info.status : "-"}</span></p>
            <p><span className="table-card-heading">Payment Status</span><span className="table-card-value">{info ? info.payment_status : "-"}</span></p>
          </div>
          <p className="table-details-2">
            <span className="table-card-heading">Ordered Items</span>
            <span className="table-card-value">{info?.ordered_items?.length ? formatOrderedItems(info.ordered_items) : "-"}</span>
          </p>
        </div>
      );
    });
  };
  

  return (
    <div className="dashboard-wrapper">
      <span className='dashboard-main-heading'>Tables</span>
      <div className="tabs">
        <div
          className={`tab-btn ${activeTab === 'total' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('total')}
        >
          Total tables
        </div>
        <div
          className={`tab-btn ${activeTab === 'active' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active tables
        </div>
      </div>

      <div className="table-grid">
        {renderTables()}
      </div>
      {showModal && (
  <div className="modal-overlay">
    <div style={{ maxHeight: '90vh', overflowY: 'auto' }} className="modal-content" role="dialog" aria-labelledby="modal-title">
      <h2 className="order-status-modal-title">Table {selectedTable?.table_no} - Update Order Status</h2>
      <div className="modal-fields">
        {orderedItemsStatus.map((item, idx) => (
          <div key={`${item.item_id}-${idx}`} className="modal-field-wrap">
            <label className="table-card-value">{item.name} ({item.quantity})</label>
            <div>
              {['accepted', 'ready', 'served'].map((status) => (
                <label
                  key={status}
                  className={`status-update-radio-lable ${item.status === status ? 'checked' : ''}`}
                >
                  <input
                    type="radio"
                    name={`status-${item.item_id}-${idx}`}
                    value={status}
                    checked={item.status === status}
                    onChange={() => handleStatusChange(idx, status)}
                    className="hidden-radio"
                  />
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Button width="30%" text={'Save'} onClick={handleSave} />
    </div>
  </div>
)}

      <ToastContainer />
    </div>
  );
};

export default Table;
