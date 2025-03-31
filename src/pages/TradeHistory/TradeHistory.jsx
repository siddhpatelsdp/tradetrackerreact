import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function TradeHistory() {
  const [trades, setTrades] = useState([]);
  const [filteredTrades, setFilteredTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    instrument: '',
    startDate: '',
    endDate: '',
    tradeType: 'all',
    sortBy: 'most-recent'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const tradesPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/siddhpatelsdp/siddhpatelsdp.github.io/refs/heads/main/projects/part6/data.json"
        );
        const data = await response.json();
        setTrades(data);
        setFilteredTrades(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let result = [...trades];

    if (filters.instrument) {
      result = result.filter(trade =>
        trade.instrument.toLowerCase().includes(filters.instrument.toLowerCase())
      );
    }

    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      result = result.filter(trade => {
        const tradeDate = new Date(trade.trade_date);
        return tradeDate >= startDate;
      });
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      result = result.filter(trade => {
        const tradeDate = new Date(trade.trade_date);
        return tradeDate <= endDate;
      });
    }

    if (filters.tradeType === 'winning') {
      result = result.filter(trade => parseFloat(trade.profit_loss) > 0);
    } else if (filters.tradeType === 'losing') {
      result = result.filter(trade => parseFloat(trade.profit_loss) < 0);
    }

    switch (filters.sortBy) {
      case 'most-recent':
        result.sort((a, b) => new Date(b.trade_date) - new Date(a.trade_date));
        break;
      case 'oldest-first':
        result.sort((a, b) => new Date(a.trade_date) - new Date(b.trade_date));
        break;
      case 'highest-profit':
        result.sort((a, b) => parseFloat(b.profit_loss) - parseFloat(a.profit_loss));
        break;
      case 'biggest-loss':
        result.sort((a, b) => parseFloat(a.profit_loss) - parseFloat(b.profit_loss));
        break;
      case 'alphabetical':
        result.sort((a, b) => a.instrument.localeCompare(b.instrument));
        break;
      default:
        break;
    }

    setFilteredTrades(result);
    setCurrentPage(1);
  }, [trades, filters]);

  const calculateMetrics = () => {
    const totalTrades = filteredTrades.length;
    let winningTrades = 0;
    let totalProfitLoss = 0;
    let bestTrade = { profit_loss: -Infinity };
    let worstTrade = { profit_loss: Infinity };

    filteredTrades.forEach((trade) => {
      const profitLoss = parseFloat(trade.profit_loss);

      if (profitLoss > 0) {
        winningTrades++;
      }

      totalProfitLoss += profitLoss;

      if (profitLoss > bestTrade.profit_loss) {
        bestTrade = trade;
      }

      if (profitLoss < worstTrade.profit_loss) {
        worstTrade = trade;
      }
    });

    const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(2) : 0;
    const avgProfitLoss = totalTrades > 0 ? (totalProfitLoss / totalTrades).toFixed(2) : 0;

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
    const number = parseFloat(value);
    return isForex ? number.toFixed(5) : number.toFixed(2);
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
        const isForex = trade.instrument.includes("/") && !["XAU/USD", "BTC/USD"].includes(trade.instrument);
        return [
          `"${trade.instrument}"`,
          formatNumber(trade.entry_price, isForex),
          formatNumber(trade.exit_price, isForex),
          trade.trade_date,
          trade.profit_loss,
          `"${trade.notes}"`
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

  if (loading) return <div>Loading trade history...</div>;
  if (error) return <div>Error loading trade history: {error}</div>;

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

          <label htmlFor="date-range">Enter Date Range:</label>
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentTrades.map(trade => {
              const isForex = trade.instrument.includes("/") && !["XAU/USD", "BTC/USD"].includes(trade.instrument);
              return (
                <tr key={trade._id}>
                  <td>{trade.instrument}</td>
                  <td>{formatNumber(trade.entry_price, isForex)}</td>
                  <td>{formatNumber(trade.exit_price, isForex)}</td>
                  <td>{trade.trade_date}</td>
                  <td>{parseFloat(trade.profit_loss).toFixed(2)}</td>
                  <td>{trade.notes}</td>
                  <td><button className="plus-icon">+</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="pagination">
          <button
            className="prev-button"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="page-info">
            {currentPage}/{totalPages}
          </span>
          <button
            className="next-button"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        <section className="live-statistics">
          <h2>Live Statistics</h2>
          <table className="stats-table">
            <tbody>
              <tr>
                <td>Total Trades</td>
                <td>{metrics.totalTrades}</td>
              </tr>
              <tr>
                <td>Win Rate</td>
                <td>{metrics.winRate}%</td>
              </tr>
              <tr>
                <td>Best Trade</td>
                <td>+{parseFloat(metrics.bestTrade.profit_loss || 0).toFixed(2)}</td>
              </tr>
              <tr>
                <td>Worst Trade</td>
                <td>{parseFloat(metrics.worstTrade.profit_loss || 0).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <button className="export-button" onClick={handleExport}>
            Export Trade History (CSV)
          </button>
        </section>
      </main>
      
    </div>
  );
}

export default TradeHistory;