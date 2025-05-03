import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useManager } from "../../context/ManagerContext";
import React from 'react';
import Logo from '../../image/final-logo.png';
import MenuIcon from '../../image/manager-menu.png';
import TableIcon from '../../image/table-icon.png';
import AnalyticsIcon from '../../image/mngr-analytics-icon.png';
import HomeIcon from '../../image/home-icon.png';
import Logout from '../../image/logout.svg';

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 👈 Get current path
  const { updateManager } = useManager();

  const handleLogout = () => {
    updateManager(null);
    navigate("/m/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className='sidebar-wrapper'>
      <div className="logo-container">
        <img src={Logo} alt="Logo" />
      </div>

      <div className="side-nav-list-wrapper">
        <Link to="/m/dashboard" className={`side-nav-list ${isActive('/m/dashboard') ? 'active' : ''}`}>
          <img src={HomeIcon} alt="Home" />
          Home
        </Link>

        <Link to="/m/tables" className={`side-nav-list ${isActive('/m/tables') ? 'active' : ''}`}>
          <img src={TableIcon} alt="Table" />
          Table
        </Link>

        <Link to="/m/menu" className={`side-nav-list ${isActive('/m/menu') ? 'active' : ''}`}>
          <img src={MenuIcon} alt="Menu" />
          Menu
        </Link>

        <Link to="/m/analytics" className={`side-nav-list ${isActive('/m/analytics') ? 'active' : ''}`}>
          <img src={AnalyticsIcon} alt="Analytics" />
          Analytics
        </Link>

        <div className="side-nav-list logout" onClick={handleLogout}>
          <img src={Logout} alt="Logout" />
          Logout
        </div>
      </div>
    </div>
  );
};

export default SideBar;
