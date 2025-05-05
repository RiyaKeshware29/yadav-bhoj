import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

import HomeIcon from '../image/home-icon.png';
import CartIcon from '../image/cart-icon.svg';
import FavoriteIcon from '../image/favorite-icon.png';
import MenuIcon from '../image/menu-icon.png';

const FooterMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const currentPath = location.pathname;

  const handleNav = (path) => {
    if (!user.isVerified) {
      navigate('/u/phone');
    } else {
      navigate(path);
    }
  };

  return (
    <div className='footer-menu-container'>
      <div
        className={`footer-menu-icon ${currentPath === '/u/' ? 'active' : ''}`}
        onClick={() => handleNav('/u/menu')}
      >
        <img src={HomeIcon} alt="Home" />
        <span>Home</span>
      </div>

      <div
        className={`footer-menu-icon ${currentPath === '/u/menu' ? 'active' : ''}`}
        onClick={() => handleNav('/u/menu')}
      >
        <img src={MenuIcon} alt="Menu" />
        <span>Menu</span>
      </div>

      <div
        className={`footer-menu-icon ${currentPath === '/u/cart' ? 'active' : ''}`}
        onClick={() => handleNav('/u/cart')}
      >
        <img src={CartIcon} alt="Cart" />
        <span>Cart</span>
      </div>

      <div
        className={`footer-menu-icon ${currentPath === '/u/order-history' ? 'active' : ''}`}
        onClick={() => handleNav('/u/order-history')}
      >
        <img src={FavoriteIcon} alt="Orders" />
        <span>Orders</span>
      </div>
    </div>
  );
};

export default FooterMenu;
