import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

function EditTrade() {
  const { id } = useParams();
  
  const [trade, setTrade] = useState({
    instrument: 'NAS100',
    entryPrice: '15320.50',
    exitPrice: '15400.75',
    tradeDate: '2025-02-02',
    profitLoss: '805.00',
    notes: 'NY session breakout'
  });

  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    /*
    fetch(`/api/trades/${id}`)
      .then(response => response.json())
      .then(data => {
        setTrade({
          instrument: data.instrument,
          entryPrice: data.entry_price,
          exitPrice: data.exit_price,
          tradeDate: data.trade_date,
          profitLoss: data.profit_loss,
          notes: data.notes
        });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching trade:', error);
        setLoading(false);
      });
    */
    setTimeout(() => setLoading(false), 500);
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTrade(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated trade:', trade);
    alert('Trade updated successfully! (This would save in a real app)');
  };

  const handleReset = () => {
    setTrade({
      instrument: 'NAS100',
      entryPrice: '15320.50',
      exitPrice: '15400.75',
      tradeDate: '2025-02-02',
      profitLoss: '805.00',
      notes: 'NY session breakout'
    });
  };

  if (loading) {
    return <div>Loading trade data...</div>;
  }

  return (
    <div className="edit-trade-page">
      
      <main>
        <h1>Edit Trade.</h1>
        <p>Edit your trade details below and click submit when done.</p>

        <form className="trade-form" onSubmit={handleSubmit}>
          <label htmlFor="instrument">Instrument:</label>
          <input
            type="text"
            id="instrument"
            name="instrument"
            value={trade.instrument}
            onChange={handleInputChange}
            required
          />
          
          <label htmlFor="entry-price">Entry Price:</label>
          <input
            type="number"
            step="0.01"
            id="entry-price"
            name="entryPrice"
            value={trade.entryPrice}
            onChange={handleInputChange}
            required
          />
          
          <label htmlFor="exit-price">Exit Price:</label>
          <input
            type="number"
            step="0.01"
            id="exit-price"
            name="exitPrice"
            value={trade.exitPrice}
            onChange={handleInputChange}
            required
          />
          
          <label htmlFor="trade-date">Trade Date:</label>
          <input
            type="date"
            id="trade-date"
            name="tradeDate"
            value={trade.tradeDate}
            onChange={handleInputChange}
            required
          />
          
          <label htmlFor="profit-loss">Profit/Loss:</label>
          <input
            type="number"
            step="0.01"
            id="profit-loss"
            name="profitLoss"
            value={trade.profitLoss}
            onChange={handleInputChange}
            required
          />
          
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            name="notes"
            value={trade.notes}
            onChange={handleInputChange}
            required
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

export default EditTrade;