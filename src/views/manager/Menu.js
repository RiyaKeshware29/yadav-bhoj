import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import EditIcon from '../../image/edit.svg';
import DeleteIcon from '../../image/delete.png';
import SearchBar from '../../component/SearchBar';
import Button from '../../component/CustomButton';
import Modal from '../../component/managerViewComponents/Modal';

const Menu = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isAddItem, setIsAddItem] = useState(true);
  const [formData, setFormData] = useState({
    category_id: '',
    item_name: '',
    item_price: '',
    available: 0,
    item_desc: '',
    category_name: '',
  });
  const [currentItemId, setCurrentItemId] = useState(null);
  const [activeTab, setActiveTab] = useState('items');
  const containerRef = useRef(null);

  const fetchMenu = async (categoryId = '') => {
    try {
      const url = categoryId ? `${apiUrl}category-item/${categoryId}` : `${apiUrl}item`;
      const res = await axios.get(url);
      setMenuItems(res.data);
    } catch (err) {
      setMenuItems([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${apiUrl}category`);
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  useEffect(() => {
    fetchMenu();
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  const handleCategoryFilterChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    fetchMenu(value);
  };

  const handleEdit = async (item_id) => {
    try {
      const res = await axios.get(`${apiUrl}item/${item_id}`);
      setFormData(res.data);
      setCurrentItemId(item_id);
      setIsAddItem(true);
      setShowModal(true);
      toast.success('Item Edited successfully');
    } catch (err) {
      console.error('Failed to fetch item:', err);
      toast.error('Failed to fetch item');
    }
  };

  const handleDelete = async (item_id) => {
    try {
      await axios.delete(`${apiUrl}item/${item_id}`);
      setMenuItems(prevItems => prevItems.filter(item => item.item_id !== item_id));
      toast.success('Item deleted successfully');
    } catch (err) {
      console.error('Failed to delete item:', err);
      toast.error('Failed to delete item');
    }
  };

  const handleCategoryEdit = async (category_id) => {
    try {
      const res = await axios.get(`${apiUrl}category/${category_id}`);
      setFormData({ category_name: res.data.category_name });
      setCurrentItemId(category_id);
      setIsAddItem(false);
      setShowModal(true);
      toast.success('Category Edited successfully');
    } catch (err) {
      console.error('Failed to fetch category:', err);
      toast.error('Failed to fetch category');
    }
  };

  const handleCategoryDelete = async (category_id) => {
    try {
      await axios.delete(`${apiUrl}category/${category_id}`);
      setCategories(prevCategories => prevCategories.filter(category => category.category_id !== category_id));
      toast.success('Category deleted successfully');
    } catch (err) {
      console.error('Failed to delete category:', err);
      toast.error('Failed to delete category');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (isAddItem) {
        if (currentItemId) {
          await axios.patch(`${apiUrl}item/${currentItemId}`, formData, {
            headers: { 'Content-Type': 'application/json' },
          });
          setMenuItems(prevItems =>
            prevItems.map(item => item.item_id === currentItemId ? { ...item, ...formData } : item)
          );
          toast.success('Item updated successfully');
        } else {
          const res = await axios.post(`${apiUrl}item`, formData, {
            headers: { 'Content-Type': 'application/json' },
          });
          setMenuItems(prevItems => [...prevItems, res.data]);
          toast.success('Item added successfully');
        }
      } else {
        if (currentItemId) {
          await axios.patch(`${apiUrl}category/${currentItemId}`, { category_name: formData.category_name }, {
            headers: { 'Content-Type': 'application/json' },
          });
          setCategories(prevCategories =>
            prevCategories.map(category => category.category_id === currentItemId ? { ...category, ...formData } : category)
          );
          toast.success('Category updated successfully');
        } else {
          const res = await axios.post(`${apiUrl}category`, { category_name: formData.category_name }, {
            headers: { 'Content-Type': 'application/json' },
          });
          setCategories(prevCategories => [...prevCategories, res.data]);
          toast.success('Category added successfully');
        }
      }

      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error('Failed to submit form:', err);
      toast.error('Failed to submit form');
    }
  };

  const resetForm = () => {
    setFormData({
      category_id: '',
      item_name: '',
      item_price: '',
      available: 0,
      item_desc: '',
      category_name: '',
    });
    setCurrentItemId(null);
  };

  return (
    <div className="dashboard-wrapper">
      <span className="dashboard-main-heading">Menu</span>

      <div className="tabs menu-tabs-header">
        <div
          className={`tab-btn ${activeTab === 'items' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          Manage Items
        </div>
        <div
          className={`tab-btn ${activeTab === 'categories' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Manage Categories
        </div>
      </div>

      <div className="tab-actions-wrapper">
        {activeTab === 'categories' && (
          <Button text={'Add New Category'} width="20%" onClick={() => { setIsAddItem(false); setCurrentItemId(null); setShowModal(true); }} />
        )}
        {activeTab === 'items' && (
          <div className='add-item-btn-wrapper'>
             <select
              value={selectedCategory}
              onChange={handleCategoryFilterChange}
              className="input"
              style={{ marginLeft: '1rem', padding: '0.5rem', width: '20%' }}
            >
              <option value="">All Category</option>
              {categories.map(category => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
            <Button text={'Add New Item'} width="20%" onClick={() => { setIsAddItem(true); setCurrentItemId(null); setShowModal(true); }} />
          </div>
        )}
      </div>

      <SearchBar
        placeholder={activeTab === 'items' ? 'Search menu items...' : 'Search categories...'}
        containerRef={containerRef}
        displayType="grid"
      />

      <div className="menu-wrapper">
        <div className="menu-header">
          {activeTab === 'items' && (
            <>
              <div>Item</div>
              <div>Category</div>
              <div>Price</div>
              <div>Available</div>
              <div>Description</div>
              <div>Actions</div>
            </>
          )}
          {activeTab === 'categories' && (
            <>
              <div>Category Name</div>
              <div>Actions</div>
            </>
          )}
        </div>

        <div ref={containerRef}>
          {activeTab === 'items' &&
            menuItems.map((item) => (
              <div className="menu-row" key={item.item_id}>
                <div>{item.item_name}</div>
                <div>{item.category_name}</div>
                <div>₹{item.item_price}</div>
                <div className='availability-toggle'>
                  <span className={item.available ? 'option available' : 'option option unavailable'}>
                    {item.available ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>{item.item_desc}</div>
                <div className="action-icons">
                  <img src={EditIcon} alt="edit" className="icon" onClick={() => handleEdit(item.item_id)} />
                  <img src={DeleteIcon} alt="delete" className="icon" onClick={() => handleDelete(item.item_id)} />
                </div>
              </div>
            ))}
          {activeTab === 'categories' &&
            categories.map((category) => (
              <div className="menu-row" key={category.category_id}>
                <div>{category.category_name}</div>
                <div className="action-icons">
                  <img src={EditIcon} alt="edit" className="icon" onClick={() => handleCategoryEdit(category.category_id)} />
                  <img src={DeleteIcon} alt="delete" className="icon" onClick={() => handleCategoryDelete(category.category_id)} />
                </div>
              </div>
            ))}
        </div>
      </div>

      <Modal showModal={showModal} onClose={() => setShowModal(false)}>
        <h2>{isAddItem ? (currentItemId ? 'Edit Item' : 'Add New Item') : (currentItemId ? 'Edit Category' : 'Add New Category')}</h2>
        <div className="modal-fields">
          {isAddItem ? (
            <>
              <div className="modal-field-wrap">
                <label className="table-card-value">Item Name</label>
                <input
                  className="input"
                  placeholder="Ex.- Dal Bati Churma"
                  type="text"
                  name="item_name"
                  onChange={handleChange}
                  value={formData.item_name}
                />
              </div>
              <div className="modal-field-wrap">
                <label className="table-card-value">Item Price</label>
                <input
                  className="input"
                  placeholder="Ex.- 250"
                  type="number"
                  name="item_price"
                  onChange={handleChange}
                  value={formData.item_price}
                />
              </div>
              <div className="modal-field-wrap">
                <label className="table-card-value">Item Category</label>
                <select
                  className="input"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  disabled={currentItemId !== null}
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.category_id} value={category.category_id}>
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-field-wrap">
                <label className="table-card-value">Item Description</label>
                <input
                  className="input"
                  placeholder="Item description"
                  type="text"
                  name="item_desc"
                  onChange={handleChange}
                  value={formData.item_desc}
                />
              </div>
              <div className="modal-field-wrap avail-gap">
                <label className="table-card-value">Item Availability</label>
                <div className="availability-toggle">
                  <input
                    type="radio"
                    id="availableYes"
                    name="available"
                    value="1"
                    checked={Number(formData.available) === 1}
                    onChange={handleChange}
                  />
                  <label htmlFor="availableYes" className="option available">Available</label>

                  <input
                    type="radio"
                    id="availableNo"
                    name="available"
                    value="0"
                    checked={Number(formData.available) === 0}
                    onChange={handleChange}
                  />
                  <label htmlFor="availableNo" className="option unavailable">Unavailable</label>
                </div>
              </div>
            </>
          ) : (
            <div className="modal-field-wrap">
              <label className="table-card-value">Category Name</label>
              <input
                className="input"
                placeholder="Ex.- Rajasthani Thali"
                type="text"
                name="category_name"
                onChange={handleChange}
                value={formData.category_name}
              />
            </div>
          )}
        </div>
        <Button width="30%" text="Submit" onClick={handleSubmit} />
      </Modal>
    </div>
  );
};

export default Menu;
