import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const authAPI = {
  signup: async (email, password) => {
    const response = await api.post('/auth/signup', { email, password });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export const cryptoAPI = {
  getTopCoins: async (currency = 'usd', limit = 100) => {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page: limit,
        page: 1,
        sparkline: false,
      },
    });
    return response.data;
  },

  getCoinChart: async (coinId, currency = 'usd', days = 7) => {
    const params = {
      vs_currency: currency,
      days,
    };
    
    // CoinGecko automatically uses hourly data for days=1
    // Only add interval for multi-day requests
    if (days > 1) {
      params.interval = 'daily';
    }
    
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
      params,
    });
    return response.data;
  },

  getCryptoNews: async () => {
    try {
      // Using CryptoCompare News API (free tier)
      const response = await axios.get('https://min-api.cryptocompare.com/data/v2/news/?lang=EN', {
        params: {
          categories: 'BTC,ETH,Trading,Blockchain',
        },
      });
      return response.data.Data || [];
    } catch (error) {
      console.error('Error fetching crypto news:', error);
      // Fallback to empty array if API fails
      return [];
    }
  },
};