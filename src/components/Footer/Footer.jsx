import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer>
      <h3>Quick Links</h3>
      <nav className="quick-links">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/add-trade">Add Trade</Link></li>
          <li><Link to="/trade-history">Trade History</Link></li>
          <li><Link to="/insights">Insights</Link></li>
          <li><Link to="/about">About Us</Link></li>
        </ul>
      </nav>
      <p>© 2025 TradeTracker. All rights reserved.</p>
    </footer>
  );
}

export default Footer;