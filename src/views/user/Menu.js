import React, { useEffect, useState, useRef } from 'react';
import FooterMenu from '../../component/FooterMenu';
import SearchBar from '../../component/SearchBar';
import CategoryButton from '../../component/CategoryButton';
import MenuItemCard from '../../component/MenuItemCard';
import Logo from '../../component/Logo';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const Menu = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const selectedItems = user.selectedItems || [];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const categoryRes = await fetch(`${apiUrl}category`);
        const menuRes = await fetch(`${apiUrl}item`);
        const categoryData = await categoryRes.json();
        const menuData = await menuRes.json();

        setCategories(categoryData);
        setMenuItems(menuData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSelectItem = (itemId) => {
    const existingItem = selectedItems.find(item => item.item_id === itemId);
    const fullItem = menuItems.find(item => item.item_id === itemId);
  
    const updatedItems = existingItem
      ? selectedItems.filter(item => item.item_id !== itemId)
      : [...selectedItems, { ...fullItem, quantity: 1 }];
  
    updateUser({ selectedItems: updatedItems });
  };
  

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleGoToCart = () => {
    const enrichedItems = selectedItems.map((selectedItem) => {
      const fullItem = menuItems.find((item) => item.item_id === selectedItem.item_id);
      return {
        ...fullItem,
        quantity: selectedItem.quantity,
      };
    });
    navigate('/u/cart', { state: { items: enrichedItems } });
  };

  const filteredItems =
    selectedCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category_id === selectedCategory);

  return (
    <div className="menu-container">
      <div className="search-bar-section">
        <Logo />
        <SearchBar containerRef={containerRef} placeholder="Search..."
          displayType="block" />
      </div>
      <div className="subheading" style={{marginLeft:'10px'}}>You're seated in : Table No. - {user.tableNumber}</div>
      <div className="menu-category-accordian">
        <div className="category-scroll">
          <CategoryButton
            key="all"
            name="All"
            isActive={selectedCategory === 'all'}
            onClick={() => handleCategoryChange('all')}
          />
          {categories.map((cat) => (
            <CategoryButton
              key={cat.category_id}
              name={cat.category_name}
              isActive={selectedCategory === cat.category_id}
              onClick={() => handleCategoryChange(cat.category_id)}
            />
          ))}
        </div>
      </div>

      <div className="menu-wrapper">
        <div className="scrollable-content" ref={containerRef}>
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.item_id}
              item={item}
              isUnavailable={item.available === 0} // 👈 add this line
              isSelected={selectedItems.some((sel) => sel.item_id === item.item_id)}
              onSelect={() => handleSelectItem(item.item_id)}
            />
          ))}
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="go-to-cart-banner" onClick={handleGoToCart}>
          <span className="go-arrow">View Cart (item {selectedItems.length}) →</span>
        </div>
      )}

      <FooterMenu />
    </div>
  );
};

export default Menu;
