import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function AddTrade() {
  const [formData, setFormData] = useState({
    instrument: '',
    entryPrice: '',
    exitPrice: '',
    tradeDate: '',
    profitLoss: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Trade submission will be implemented later');
  };

  const handleReset = () => {
    setFormData({
      instrument: '',
      entryPrice: '',
      exitPrice: '',
      tradeDate: '',
      profitLoss: '',
      notes: ''
    });
  };

  return (
    <div className="add-trade-page">
      
      <main>
        <h1>Log a New Trade.</h1>
        <p>Enter your trade details below and track your performance over time.</p>
        
        <form className="trade-form" onSubmit={handleSubmit}>
          <label htmlFor="instrument">Instrument:</label>
          <input
            type="text"
            id="instrument"
            name="instrument"
            value={formData.instrument}
            onChange={handleInputChange}
            required
          />
          
          <label htmlFor="entry-price">Entry Price:</label>
          <input
            type="number"
            step="0.01"
            id="entry-price"
            name="entryPrice"
            value={formData.entryPrice}
            onChange={handleInputChange}
            required
          />
          
          <label htmlFor="exit-price">Exit Price:</label>
          <input
            type="number"
            step="0.01"
            id="exit-price"
            name="exitPrice"
            value={formData.exitPrice}
            onChange={handleInputChange}
            required
          />
          
          <label htmlFor="trade-date">Trade Date:</label>
          <input
            type="date"
            id="trade-date"
            name="tradeDate"
            value={formData.tradeDate}
            onChange={handleInputChange}
            required
          />
          
          <label htmlFor="profit-loss">Profit/Loss:</label>
          <input
            type="number"
            step="0.01"
            id="profit-loss"
            name="profitLoss"
            value={formData.profitLoss}
            onChange={handleInputChange}
            required
          />
          
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
          />
          
          <div className="form-buttons">
            <button type="submit">Submit Trade</button>
            <button type="button" onClick={handleReset}>
              Reset Form
            </button>
          </div>
        </form>
      </main>
      
    </div>
  );
}

export default AddTrade;