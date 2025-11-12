import { useState, useEffect } from "react";
import axios from "axios";
import CoinChart from "./CoinChart";
import { Navigate } from "react-router-dom";
import "./App.css";

export default function CryptoDashboard({ search, currency }) {
  const [coins, setCoins] = useState([]);
  const [selectedCoinId, setSelectedCoinId] = useState(null);
  const [selectedCoinName, setSelectedCoinName] = useState("");

  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;

  useEffect(() => {
    fetchCoins();

    // Refresh prices every 5 minutes (300000 ms)
    const priceInterval = setInterval(() => {
      fetchCoins();
    }, 300000);

    return () => clearInterval(priceInterval);
  }, [currency]);

  const fetchCoins = async () => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets`,
        {
          params: {
            vs_currency: currency,
            order: "market_cap_desc",
            per_page: 100,
            page: 1,
            sparkline: false,
          },
        }
      );
      setCoins(response.data);
    } catch (error) {
      console.error("Error fetching coins:", error);
    }
  };

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCoinClick = (coinId, coinName) => {
    setSelectedCoinId(coinId);
    setSelectedCoinName(coinName);
  };

  return (
    <div className="dashboard">
      <div className="header">
        <div className="top-bar">
          <h1>Crypto Dashboard</h1>
        </div>
      </div>

      <div className="coin-grid">
        {filteredCoins.map((coin) => (
          <div
            key={coin.id}
            className="coin-card"
            onClick={() => handleCoinClick(coin.id, coin.name)}
          >
            <div className="coin-info">
              <img src={coin.image} alt={coin.name} className="coin-logo" />
              <div>
                <h2>{coin.name}</h2>
                <p>{coin.symbol.toUpperCase()}</p>
              </div>
            </div>
            <p>
              Price: {coin.current_price} {currency.toUpperCase()}
            </p>
            <p
              className={
                coin.price_change_percentage_24h >= 0 ? "positive" : "negative"
              }
            >
              24h Change: {coin.price_change_percentage_24h.toFixed(2)}%
            </p>
          </div>
        ))}
      </div>

      {selectedCoinId && (
        <div className="chart-section">
          <h2>{selectedCoinName} - 24 Hour Price Chart</h2>
          <CoinChart coinId={selectedCoinId} currency={currency} />
        </div>
      )}
    </div>
  );
}
