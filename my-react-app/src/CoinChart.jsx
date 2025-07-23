import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { cryptoAPI } from './api';
import './Chart.css';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function CoinChart({ coinId, currency }) {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChart = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await cryptoAPI.getCoinChart(coinId, currency, 7);
        setChartData(data.prices);
      } catch (error) {
        setError("Failed to load chart data. Unable to fetch price chart. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChart();
  }, [coinId, currency]);

  if (isLoading) {
    return (
      <div className="chart-loading">
        <div className="chart-loading-content">
          <div className="chart-loading-spinner"></div>
          <div className="chart-loading-text">Loading chart...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-error">
        <svg className="chart-error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className="chart-error-title">Failed to load chart</h3>
        <p className="chart-error-message">{error}</p>
        <button className="chart-error-button" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  const data = {
    labels: chartData.map((entry) => {
      const date = new Date(entry[0]);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }),
    datasets: [
      {
        label: `Price in ${currency.toUpperCase()}`,
        data: chartData.map((entry) => entry[1]),
        fill: true,
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        borderWidth: 2,
        pointBackgroundColor: '#0ea5e9',
        pointBorderColor: '#0a0a0b',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#111113',
        titleColor: '#fafafa',
        bodyColor: '#fafafa',
        borderColor: '#27272a',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Price: ${new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: currency.toUpperCase(),
              minimumFractionDigits: 2,
              maximumFractionDigits: 8,
            }).format(context.parsed.y)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: '#27272a',
          drawBorder: false,
        },
        ticks: {
          color: '#a1a1aa',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: '#27272a',
          drawBorder: false,
        },
        ticks: {
          color: '#a1a1aa',
          font: {
            size: 12,
          },
          callback: function(value) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: currency.toUpperCase(),
              notation: 'compact',
            }).format(value);
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    elements: {
      point: {
        hoverBorderWidth: 3,
      },
    },
  };

  return (
    <div className="chart-container">
      <div className="chart-wrapper">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}