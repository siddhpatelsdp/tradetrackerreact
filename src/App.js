import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import AddTrade from './pages/AddTrade/AddTrade';
import TradeHistory from './pages/TradeHistory/TradeHistory';
import Insights from './pages/Insights/Insights';
import About from './pages/About/About';
import EditTrade from './pages/EditTrade/EditTrade';
import './styles/Global.css';

function App() {
  const [trades, setTrades] = useState([]);

  // Function to add a new trade to the state
  const addTrade = (newTrade) => {
    setTrades(prevTrades => [...prevTrades, newTrade]);
  };

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-trade" element={<AddTrade addTrade={addTrade} />} />
            <Route path="/trade-history" element={<TradeHistory trades={trades} />} />
            <Route path="/trade-history/:id" element={<EditTrade />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;