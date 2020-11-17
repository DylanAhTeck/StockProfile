const axios = require('axios');

const headers = {
  'Content-Type': 'application/json',
  Authorization: 'Token 14042d0dd6b6fff20e627a4e3fa8c7d73c65fdf3',
};

exports.CompanyDescription = async (ticker) => {
  try {
    const config = {
      method: 'get',
      url: `https://api.tiingo.com/tiingo/daily/${ticker}`,
      headers: headers,
    };
    const response = await axios(config);
    return response.data;
  } catch (err) {
    return err.message;
  }
};

exports.News = async (ticker) => {
  try {
    console.log('HERE');
    const config = {
      method: 'get',
      //url: `https://newsapi.org/v2/everything?q=${ticker}`,

      url: `https://newsapi.org/v2/everything?q=${ticker}&apiKey=81519208556343cc999246b8ead24245`,
      headers: {
        'Content-Type': 'application/json',
        // Authorization: 'apiKey 81519208556343cc999246b8ead24245',
      },
    };
    const response = await axios(config);
    return response;
  } catch (err) {
    return err.message;
  }
};
exports.CompanyLatestPrice = async (ticker) => {
  try {
    const config = {
      method: 'get',
      url: `https://api.tiingo.com/iex/${ticker}`,
      headers: headers,
    };
    const response = await axios(config);
    return response.data;
  } catch (err) {
    return err.message;
  }
};

exports.CompanyHistoricalData = async (ticker, startDate, resampleFreq) => {
  try {
    const config = {
      method: 'get',
      url: `https://api.tiingo.com/tiingo/daily/${ticker}/prices?startDate=${startDate}&resampleFreq=${resampleFreq}`,
      headers: headers,
    };

    console.log(config.url);
    const response = await axios(config);
    return response.data;
  } catch (err) {
    return err.message;
  }
};

exports.CompanyDailyChart = async (ticker, startDate, resampleFreq) => {
  try {
    const config = {
      method: 'get',
      url: `https://api.tiingo.com/iex/${ticker}/prices?startDate=${startDate}&resampleFreq=${resampleFreq}`,
      headers: headers,
    };

    const response = await axios(config);
    return response.data;
  } catch (err) {
    return err.message;
  }
};

exports.Autocomplete = async (query) => {
  try {
    const config = {
      method: 'get',
      url: `https://api.tiingo.com/tiingo/utilities/search?query=${query}`,
      headers: headers,
    };

    const response = await axios(config);
    return response.data;
  } catch (err) {
    return err.message;
  }
};
