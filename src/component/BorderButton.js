import React from 'react';

const CustomButton = ({ width, text, onClick }) => {
  return (
    <button style={{ width }} className="border-button" onClick={onClick}>
      {text}
    </button>
  );
};

export default CustomButton;
