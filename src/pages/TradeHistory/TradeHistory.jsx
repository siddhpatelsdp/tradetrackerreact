import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TradeHistory.css';
import { API_URL } from '../../config';

function TradeHistory({ trades: initialTrades }) {
  const [trades, setTrades] = useState(initialTrades || []);
  const [filteredTrades, setFilteredTrades] = useState(initialTrades || []);
  const [loading, setLoading] = useState(!initialTrades || initialTrades.length === 0);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    instrument: '',
    startDate: '',
    endDate: '',
    tradeType: 'all',
    sortBy: 'most-recent'
  });
  const [currentPage, setCurrentPage] = useState(1);
  // Add delete handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trade?')) return;
    try {
      const response = await fetch(`${API_URL}/trades/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');
      // Remove from both trades and filteredTrades
      setTrades(prev => prev.filter(t => t._id !== id));
      setFilteredTrades(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete trade');
    }
  };
  const tradesPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/trades`, {
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setTrades(data);
        setFilteredTrades(data);
      } catch (err) {
        console.error('Error fetching trades:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = [...trades];

    if (filters.instrument) {
      result = result.filter(trade =>
        trade.instrument && 
        trade.instrument.toLowerCase().includes(filters.instrument.toLowerCase())
      );
    }

    if (filters.startDate) {
      const startOfDay = new Date(`${filters.startDate}T00:00:00.000`);
      result = result.filter(trade => {
        const tradeDate = trade.trade_date ? new Date(trade.trade_date) : null;
        return tradeDate && tradeDate >= startOfDay;
      });
    }

    if (filters.endDate) {
      const endOfDay = new Date(`${filters.endDate}T23:59:59.999`);
      result = result.filter(trade => {
        const tradeDate = trade.trade_date ? new Date(trade.trade_date) : null;
        return tradeDate && tradeDate <= endOfDay;
      });
    }

    if (filters.tradeType === 'winning') {
      result = result.filter(trade => trade.profit_loss && parseFloat(trade.profit_loss) > 0);
    } else if (filters.tradeType === 'losing') {
      result = result.filter(trade => trade.profit_loss && parseFloat(trade.profit_loss) < 0);
    }

    switch (filters.sortBy) {
      case 'most-recent':
        result.sort((a, b) => {
          const dateA = a.trade_date ? new Date(a.trade_date) : 0;
          const dateB = b.trade_date ? new Date(b.trade_date) : 0;
          return dateB - dateA;
        });
        break;
      case 'oldest-first':
        result.sort((a, b) => {
          const dateA = a.trade_date ? new Date(a.trade_date) : 0;
          const dateB = b.trade_date ? new Date(b.trade_date) : 0;
          return dateA - dateB;
        });
        break;
      case 'highest-profit':
        result.sort((a, b) => {
          const profitA = parseFloat(a.profit_loss ?? -Infinity);
          const profitB = parseFloat(b.profit_loss ?? -Infinity);
          return profitB - profitA;
        });
        break;
      case 'biggest-loss':
        result.sort((a, b) => {
          const profitA = parseFloat(a.profit_loss ?? Infinity);
          const profitB = parseFloat(b.profit_loss ?? Infinity);
          return profitA - profitB;
        });
        break;
      case 'alphabetical':
        result.sort((a, b) => {
          const instA = (a.instrument || '').toLowerCase();
          const instB = (b.instrument || '').toLowerCase();
          return instA.localeCompare(instB);
        });
        break;
      default:
        break;
    }

    setFilteredTrades(result);
    setCurrentPage(1);
  }, [trades, filters]);

  const calculateMetrics = () => {
    const totalTrades = filteredTrades.length;
    if (totalTrades === 0) {
      return {
        totalTrades: 0,
        winRate: "0.00",
        avgProfitLoss: "0.00",
        bestTrade: null,
        worstTrade: null,
      };
    }
  
    let winningTrades = 0;
    let totalProfitLoss = 0;
    let bestTrade = null;
    let worstTrade = null;
  
    filteredTrades.forEach((trade) => {
      const profitLoss = trade.profit_loss ? parseFloat(trade.profit_loss) : 0;
  
      totalProfitLoss += profitLoss;
  
      if (profitLoss > 0) {
        winningTrades++;
        if (!bestTrade || profitLoss > parseFloat(bestTrade.profit_loss)) {
          bestTrade = trade;
        }
      }
  
      if (profitLoss < 0) {
        if (!worstTrade || profitLoss < parseFloat(worstTrade.profit_loss)) {
          worstTrade = trade;
        }
      }
    });
  
    const winRate = ((winningTrades / totalTrades) * 100).toFixed(2);
    const avgProfitLoss = (totalProfitLoss / totalTrades).toFixed(2);
  
    return {
      totalTrades,
      winRate,
      avgProfitLoss,
      bestTrade,
      worstTrade,
    };
  };

  const metrics = calculateMetrics();

  const formatNumber = (value, isForex) => {
    if (value === undefined || value === null || isNaN(parseFloat(value))) {
      return "N/A";
    }
    const number = parseFloat(value);
    return isForex ? number.toFixed(5) : number.toFixed(2);
  };

  // Strict MM/DD/YYYY formatter
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  const indexOfLastTrade = currentPage * tradesPerPage;
  const indexOfFirstTrade = indexOfLastTrade - tradesPerPage;
  const currentTrades = filteredTrades.slice(indexOfFirstTrade, indexOfLastTrade);
  const totalPages = Math.ceil(filteredTrades.length / tradesPerPage);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleExport = () => {
    const headers = ['Instrument', 'Entry Price', 'Exit Price', 'Date', 'Profit/Loss', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...filteredTrades.map(trade => {
        const isForex = trade.instrument && typeof trade.instrument === 'string' && 
                       (trade.instrument.includes("/") || 
                        ["EURUSD", "USDJPY", "XAUUSD"].includes(trade.instrument.toUpperCase()));
        return [
          `"${trade.instrument || ''}"`,
          formatNumber(trade.entry_price, isForex),
          formatNumber(trade.exit_price, isForex),
          trade.trade_date ? new Date(trade.trade_date).toISOString().split('T')[0] : '',
          trade.profit_loss || '',
          `"${trade.notes || ''}"`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'trade_history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="loading-message">Loading trade history...</div>;
  if (error) return <div className="error-message">Error loading trade history: {error}</div>;

  return (
    <div className="trade-history-page">
      <main>
        <h1>Your Trade History.</h1>
        <p>View, filter, and analyze your past trades to refine your strategy.</p>

        <div className="filters">
        <label htmlFor="instrument-name">Enter Instrument Name:</label>
          <input
            type="text"
            id="instrument-name"
            name="instrument"
            placeholder="e.g., NAS100"
            value={filters.instrument}
            onChange={handleFilterChange}
          />

          <label htmlFor="start-date">Enter Date Range:</label>
          <input
            type="date"
            id="start-date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
          <span>to</span>
          <input
            type="date"
            id="end-date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />

          <label htmlFor="filter-trades">Filter trades:</label>
          <select
            id="filter-trades"
            name="tradeType"
            value={filters.tradeType}
            onChange={handleFilterChange}
          >
            <option value="all">All Trades</option>
            <option value="winning">Winning Trades Only</option>
            <option value="losing">Losing Trades Only</option>
          </select>

          <label htmlFor="sort-trades">Sort trades by:</label>
          <select
            id="sort-trades"
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
          >
            <option value="most-recent">Most Recent Trades</option>
            <option value="oldest-first">Oldest First</option>
            <option value="highest-profit">Highest Profit</option>
            <option value="biggest-loss">Biggest Loss</option>
            <option value="alphabetical">Alphabetical (Ticker Symbol)</option>
          </select>
        </div>

        <table className="trade-table">
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Entry Price</th>
              <th>Exit Price</th>
              <th>Date</th>
              <th>Profit/Loss</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {currentTrades.map((trade, index) => {
    const isForex = trade?.instrument && (
      trade.instrument.includes("/") || 
      ["EURUSD", "USDJPY", "XAUUSD"].includes(trade.instrument.toUpperCase())
    );

    const key = trade._id || `${trade.instrument}-${trade.trade_date}-${index}`;

    return (
      <tr key={key}>
        <td>{trade.instrument || "N/A"}</td>
        <td>{formatNumber(trade.entry_price, isForex)}</td>
        <td>{formatNumber(trade.exit_price, isForex)}</td>
        <td>{formatDate(trade.trade_date)}</td>
        <td className={trade.profit_loss >= 0 ? 'profit' : 'loss'}>
          {formatNumber(trade.profit_loss, false)}
        </td>
        <td>{trade.notes || ""}</td>
        <td className="actions-cell">
          <Link
            to={`/edit-trade/${trade._id}`}
            className="action-button edit-button"
          >
            Edit
          </Link>
          <button
            className="action-button delete-button"
            onClick={() => handleDelete(trade._id)}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  })}
          </tbody>
        </table>

        {filteredTrades.length > 0 && (
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        <div className="trade-metrics">
          <h2>Performance Metrics</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Total Trades</h3>
              <p>{metrics.totalTrades}</p>
            </div>
            <div className="metric-card">
              <h3>Win Rate</h3>
              <p>{metrics.winRate}%</p>
            </div>
            <div className="metric-card">
              <h3>Avg. P/L Per Trade</h3>
              <p className={metrics.avgProfitLoss >= 0 ? 'profit' : 'loss'}>
                {metrics.avgProfitLoss}
              </p>
            </div>
          </div>
        </div>

        <button className="export-button" onClick={handleExport}>
          Export to CSV
        </button>
      </main>
    </div>
  );
}

export default TradeHistory;