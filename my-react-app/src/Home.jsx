import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cryptoAPI } from './api';
import './Home.css';

export default function Home() {
  const [topCoins, setTopCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopCoins = async () => {
      try {
        const data = await cryptoAPI.getTopCoins('usd', 3);
        setTopCoins(data);
      } catch (error) {
        setError("Failed to fetch crypto data. Please check your internet connection and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopCoins();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price);
  };

  const formatMarketCap = (marketCap) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
    }).format(marketCap);
  };

  if (isLoading) {
    return (
      <div className="home-container">
        <div className="loading-container">
          <div className="section-header">
            <div className="loading-placeholder large"></div>
            <div className="loading-placeholder medium"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Track{' '}
            <span className="hero-title-highlight">
              Cryptocurrency
            </span>{' '}
            Prices
          </h1>
          <p className="hero-description">
            Stay updated with real-time cryptocurrency prices, market trends, and detailed analytics 
            for all your favorite digital assets.
          </p>
          <button className="hero-button" onClick={() => navigate('/dashboard')}>
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            Go to Dashboard
            <svg className="icon arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Top Cryptocurrencies */}
      <section className="top-coins-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Top 3 Cryptocurrencies</h2>
            <p className="section-description">
              Leading digital assets by market capitalization
            </p>
          </div>

          {error ? (
            <div className="text-center text-destructive">{error}</div>
          ) : (
            <div className="coins-grid">
              {topCoins.map((coin, index) => (
                <div key={coin.id} className="coin-card">
                  <div className="coin-card-header">
                    <div className="coin-info">
                      <img 
                        src={coin.image} 
                        alt={coin.name}
                        className="coin-image"
                      />
                      <div>
                        <h3 className="coin-name">{coin.name}</h3>
                        <p className="coin-symbol">
                          {coin.symbol}
                        </p>
                      </div>
                    </div>
                    <div className="coin-rank">
                      #{index + 1}
                    </div>
                  </div>
                  <div className="coin-details">
                    <div className="coin-price">
                      {formatPrice(coin.current_price)}
                    </div>
                    <div className={`coin-change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                      {coin.price_change_percentage_24h >= 0 ? (
                        <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      ) : (
                        <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                        </svg>
                      )}
                      <span>
                        {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </div>
                    <div className="coin-market-cap">
                      Market Cap: {formatMarketCap(coin.market_cap)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* News Section */}
      <section className="news-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Trending Crypto News</h2>
            <p className="section-description">
              Stay informed with the latest cryptocurrency developments
            </p>
          </div>

          <div className="news-grid">
            {[
              "Bitcoin reaches new all-time high amid institutional adoption",
              "Ethereum 2.0 upgrade shows promising scalability improvements",
              "Major banks announce cryptocurrency custody services",
              "Regulatory clarity drives institutional investment in crypto"
            ].map((news, index) => (
              <div key={index} className="news-item">
                <div className="news-content">
                  <div className="news-indicator"></div>
                  <p className="news-text">{news}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}