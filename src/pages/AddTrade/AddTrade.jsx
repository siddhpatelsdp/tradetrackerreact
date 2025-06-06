import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AddTrade.css';
import { API_URL } from '../../config';

function AddTrade({ addTrade }) {
  const [formData, setFormData] = useState({
    instrument: '',
    entryPrice: '',
    exitPrice: '',
    tradeDate: (() => {
      return new Date().toLocaleDateString('en-CA');
    })(),
    profitLoss: '',
    notes: ''
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.instrument || formData.instrument.length < 2) {
      return 'Instrument must be at least 2 characters';
    }
    
    if (!formData.entryPrice || !/^[+-]?\d*\.?\d+$/.test(formData.entryPrice)) {
      return 'Entry price must be a valid number';
    }
    
    if (!formData.exitPrice || !/^[+-]?\d*\.?\d+$/.test(formData.exitPrice)) {
      return 'Exit price must be a valid number';
    }
    
    if (!formData.tradeDate) {
      return 'Trade date is required';
    }
    
    if (formData.profitLoss && !/^[+-]?\d*\.?\d+$/.test(formData.profitLoss)) {
      return 'Profit/Loss must be a valid number';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setSubmissionStatus(`Error: ${validationError}`);
      return;
    }
    
    setSubmissionStatus('Submitting trade...');
    
    try {
      const profitLossValue = formData.profitLoss || 
        (parseFloat(formData.exitPrice) - parseFloat(formData.entryPrice)).toFixed(2);

      const localDate = formData.tradeDate;

      const finalFormData = {
        ...formData,
        tradeDate: localDate,
        profitLoss: profitLossValue
      };

      const response = await fetch(`${API_URL}/trades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalFormData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error adding trade:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const newTrade = await response.json();
      console.log('New trade added:', newTrade);
      const transformedTrade = {
        _id:         newTrade._id,
        instrument:  newTrade.instrument,
        entry_price: newTrade.entry_price,
        exit_price:  newTrade.exit_price,
        trade_date:  newTrade.trade_date,
        profit_loss: newTrade.profit_loss,
        notes:       newTrade.notes || '',
      };
      const updatedResponse = await fetch(`${API_URL}/trades`);
      const updatedTrades = await updatedResponse.json();
      addTrade(updatedTrades);
      setSubmissionStatus('Trade successfully added!');
      
      setFormData({
        instrument: '',
        entryPrice: '',
        exitPrice: '',
        tradeDate: (() => {
          return new Date().toLocaleDateString('en-CA');
        })(),
        profitLoss: '',
        notes: ''
      });
      
    } catch (error) {
      console.error('Error submitting trade:', error);
      setSubmissionStatus(`Error: ${error.message}`);
    }
  };

  const handleReset = () => {
    setFormData({
      instrument: '',
      entryPrice: '',
      exitPrice: '',
      tradeDate: (() => {
        return new Date().toLocaleDateString('en-CA');
      })(),
      profitLoss: '',
      notes: ''
    });
    setSubmissionStatus(null);
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
            minLength="2"
            placeholder="e.g., NAS100, EUR/USD, XAUUSD"
          />
          
          <label htmlFor="entry-price">Entry Price:</label>
          <input
            type="text"
            id="entry-price"
            name="entryPrice"
            value={formData.entryPrice}
            onChange={handleInputChange}
            required
            placeholder="e.g., 18000.50 or 1.23456"
          />
          
          <label htmlFor="exit-price">Exit Price:</label>
          <input
            type="text"
            id="exit-price"
            name="exitPrice"
            value={formData.exitPrice}
            onChange={handleInputChange}
            required
            placeholder="e.g., 18100.75 or 1.23500"
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
          
          <label htmlFor="profit-loss">Profit/Loss (optional):</label>
          <input
            type="text"
            id="profit-loss"
            name="profitLoss"
            value={formData.profitLoss}
            onChange={handleInputChange}
            placeholder="e.g., +100.50 or -50.25"
          />
          
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Any additional notes about the trade"
          />
          
          <div className="form-buttons">
            <button type="submit">Submit Trade</button>
            <button type="button" onClick={handleReset}>
              Reset Form
            </button>
          </div>
          
          {submissionStatus && (
            <div className={`submission-status ${
              submissionStatus.includes('Error') ? 'error' : 'success'
            }`}>
              {submissionStatus}
            </div>
          )}
        </form>
      </main>
    </div>
  );
}

export default AddTrade;