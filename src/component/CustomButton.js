import React from 'react';

const CustomButton = ({ width = '100%', text, onClick, type = 'button' }) => {
  return (
    <button
      type={type}
      style={{ width }}
      className="button"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default CustomButton;
