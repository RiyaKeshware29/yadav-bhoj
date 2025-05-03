import React, { useState } from 'react';
import SearchIcon from '../image/search1.png'; 

const SearchBar = ({ containerRef, placeholder = "Search...", displayType = "block" }) => {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    if (containerRef?.current) {
      const children = containerRef.current.children;
      Array.from(children).forEach((child) => {
        const text = child.textContent.toLowerCase();
        child.style.display = text.includes(value) ? displayType : "none";
      });
    }
  };

  return (
    <div className="search-bar-container">
      <img className="search-icon" src={SearchIcon} alt="Search" />
      <input
        className="search-input"
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
