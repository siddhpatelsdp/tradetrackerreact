import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Insights() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({
    totalTrades: 0,
    winRate: 0,
    avgProfitLoss: 0,
    bestTrade: { profit_loss: 0 },
    worstTrade: { profit_loss: 0 }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/siddhpatelsdp/siddhpatelsdp.github.io/refs/heads/main/projects/part6/data.json"
        );
        const data = await response.json();
        setTrades(data);
        calculateMetrics(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateMetrics = (data) => {
    const totalTrades = data.length;
    let winningTrades = 0;
    let totalProfitLoss = 0;
    let bestTrade = { profit_loss: -Infinity };
    let worstTrade = { profit_loss: Infinity };

    data.forEach((trade) => {
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

    setMetrics({
      totalTrades,
      winRate,
      avgProfitLoss,
      bestTrade,
      worstTrade,
    });
  };

  if (loading) return <div>Loading insights...</div>;
  if (error) return <div>Error loading insights: {error}</div>;

  return (
    <div className="insights-page">
      
      <main>
        <h1>Your Trading Insights.</h1>
        <p>Analyze your trading performance with key metrics and charts.</p>

        <section className="key-statistics">
          <h2>Key Statistics</h2>
          <table className="key-stats-table">
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
                <td>Avg. P/L Per Trade</td>
                <td>{metrics.avgProfitLoss}</td>
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
        </section>

        <section className="charts">
          <h2>Performance Charts</h2>
          <div className="charts-container">
            <img 
              src={`${process.env.PUBLIC_URL}/assets/images/P:L_CHART.jpg`} 
              alt="Profit/Loss Chart" 
              className="chart-image"
            />
            <img 
              src={`${process.env.PUBLIC_URL}/assets/images/WL_PIE_CHART.jpg`} 
              alt="Wins vs Losses Pie Chart" 
              className="chart-image"
            />
          </div>
        </section>
      </main>
      
    </div>
  );
}

export default Insights;