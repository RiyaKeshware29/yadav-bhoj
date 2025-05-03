// MenuItemCard.jsx
import React from 'react';
import Button from './CustomButton'

const MenuItemCard = ({ item, isSelected, isUnavailable,onSelect }) => {
  return (
    <div className={`menu-item-card ${isUnavailable ? 'unavailable-item' : ''} ${isSelected ? 'selected' : ''}`}>
      <div className="item-info">
        <h4 className='item-name'>{item.item_name}</h4>
        <p className='item-price'>₹ {item.item_price}</p>
        <p className='item-desc'>{item.item_desc}</p>
      </div>
      <Button
        width="90%"
        text={isSelected ? "Deselect" : "Select"}
        onClick={(e) => {
          e.stopPropagation(); // prevent parent clicks if needed
          onSelect(item.item_id);
        }}
        disabled={!item.available}
      />
    </div>
  );
};

export default MenuItemCard;
