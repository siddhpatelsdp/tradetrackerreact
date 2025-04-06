import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      
      <main>
        <h1>Track, Analyze, and Improve Your Trades.</h1>
        <p>A simple yet powerful tool for day traders to log and review their trades.</p>
        
        <div className="visual-placeholder">
          <iframe 
            width="800" 
            height="450" 
            src="https://www.youtube-nocookie.com/embed/HyYpY69Zk6Y?si=0dFI5nbVLEkoE4eJ&autoplay=1&mute=1&loop=1&playlist=HyYpY69Zk6Y&controls=0&modestbranding=1&rel=0&iv_load_policy=3" 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen>
          </iframe>
        </div>
        
        <div className="cta-buttons">
          <Link to="/add-trade">
            <button>Start Tracking</button>
          </Link>
          <Link to="/insights">
            <button>View Insights</button>
          </Link>
        </div>
        
        <section className="feature-highlights">
          <h2>Feature Highlights</h2>
          
          <table>
            <tbody>
              <tr>
                <th>Log Your Trades Easily</th>
                <th>Analyze Performance</th>
                <th>Export & Share</th>
              </tr>
              <tr>
                <td>Effortlessly input your trade details, including ticker symbol, entry and exit prices, trade date, and notes. Keep your trading journal organized and accessible anytime.</td>
                <td>Visualize your trading history with interactive charts and key metrics. Track your profit/loss trends, win rate, and performance insights to refine your strategies.</td>
                <td>Download your full trade history as a CSV file for offline analysis. Easily share your trades or import them into external tools for deeper financial tracking.</td>
              </tr>
            </tbody>
          </table>

          <div className="feature-highlight-item">
            <h3>Log Your Trades Easily</h3>
            <p>Effortlessly input your trade details, including ticker symbol, entry and exit prices, trade date, and notes. Keep your trading journal organized and accessible anytime.</p>
          </div>
          <div className="feature-highlight-item">
            <h3>Analyze Performance</h3>
            <p>Visualize your trading history with interactive charts and key metrics. Track your profit/loss trends, win rate, and performance insights to refine your strategies.</p>
          </div>
          <div className="feature-highlight-item">
            <h3>Export & Share</h3>
            <p>Download your full trade history as a CSV file for offline analysis. Easily share your trades or import them into external tools for deeper financial tracking.</p>
          </div>
        </section>
      </main>
      
    </div>
  );
}

export default Home;