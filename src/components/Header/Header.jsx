import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  useEffect(() => {
    const toggleMenu = () => {
      const menuBar = document.querySelector('.small-menu');
      const hamburgerIcon = document.querySelector('.hamburger-icon');

      menuBar.classList.toggle('expanded');
      hamburgerIcon.classList.toggle('active');
    };

    const toggleMenuButton = document.querySelector('.hamburger-icon');
    if (toggleMenuButton) {
      toggleMenuButton.addEventListener('click', toggleMenu);
    }

    return () => {
      if (toggleMenuButton) {
        toggleMenuButton.removeEventListener('click', toggleMenu);
      }
    };
  }, []);

  return (
    <header>
      <nav>
        <div className="logo">
          <Link to="/">
            <img 
              src={`${process.env.PUBLIC_URL}/assets/images/TRADE_TRACKER_LOGO.jpg`} 
              alt="Trade Tracker Logo" 
            />
          </Link>
        </div>            
        
        <div className="large-menu">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/add-trade">Add Trade</Link></li>
            <li><Link to="/trade-history">Trade History</Link></li>
            <li><Link to="/insights">Insights</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>
        
        <div className="menu-bar small-menu">
          <div className="toggle-menu">
            <span className="hamburger-icon">&#9776;</span>
          </div>
          <ul className="menu-items">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/add-trade">Add Trade</Link></li>
            <li><Link to="/trade-history">Trade History</Link></li>
            <li><Link to="/insights">Insights</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </div>
        
        <div className="login-icon">
          <img 
            src={`${process.env.PUBLIC_URL}/assets/images/LOGIN_ICON.jpg`} 
            alt="Login Icon" 
          />
        </div>
      </nav>
    </header>
  );
}

export default Header;