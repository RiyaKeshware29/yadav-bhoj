// CategoryButton.jsx
import React from 'react';

const CategoryButton = ({ name, isActive, onClick }) => {
  return (
    <button
      className={`category-button ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      {name}
    </button>
  );
};

export default CategoryButton;
