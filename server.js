const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// import express from 'express';
// import axios from 'axios';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import path from 'path';

const {
  CompanyDescription,
  CompanyDailyChart,
  CompanyHistoricalData,
  CompanyLatestPrice,
  Autocomplete,
  News,
} = require('./tiingo_api');

const app = express();
app.use(bodyParser.json());
app.use(cors());

/*
 * It shows the details of the <ticker>.
 * @param
 * @return Default
 * Call this route: https://api.tiingo.com/tiingo/utilities/search/%3Cquery
 */

app.get('/details/description/:ticker', async (req, res) => {
  const ticker = req.params.ticker;
  const ans = await CompanyDescription(ticker);
  //console.log(ans);
  res.header('Access-Control-Allow-Origin', '*');
  res.send(ans);
});

app.get('/details/price/:ticker', async (req, res) => {
  const ticker = req.params.ticker;
  res.header('Access-Control-Allow-Origin', '*');
  const body = await CompanyLatestPrice(ticker);
  res.send(body[0]);
});

app.get('/details/highcharts/daily', async (req, res) => {
  let ticker = req.query.ticker;
  let startDate = req.query.startDate;
  let resampleFreq = req.query.resampleFreq;

  const body = await CompanyDailyChart(ticker, startDate, resampleFreq);
  res.header('Access-Control-Allow-Origin', '*');
  res.send(body);
});

app.get('/details/news/:ticker', async (req, res) => {
  const ticker = req.params.ticker;
  res.header('Access-Control-Allow-Origin', '*');
  const body = await News(ticker);
  res.send(body.data.articles);
});

app.get('/details/highcharts/historical', async (req, res) => {
  // const ticker = 'AAPL';
  // const startDate = new Date();
  // const resampleFreq = 'daily';

  let ticker = req.query.ticker;
  let startDate = req.query.startDate;
  let resampleFreq = req.query.resampleFreq;

  const body = await CompanyHistoricalData(ticker, startDate, resampleFreq);
  res.header('Access-Control-Allow-Origin', '*');
  res.send(body);
});

/*
 * Retrieves the possible tickers for the given value through Tiingo's search api
 * @param query is the User's form input that the route auto-completes
 * @return an array of objects with name, ticker
 * Call this route:https://api.tiingo.com/tiingo/utilities/search/%3Cquery
 */

app.get('/autocomplete/:query', async (req, res) => {
  const query = req.params.query;
  const autocomplete = await Autocomplete(query);
  res.header('Access-Control-Allow-Origin', '*');
  res.send(autocomplete);
});

// //Set the base path to the angular-test dist folder
// app.use(express.static(path.join(__dirname, 'my-app/dist/my-app')));

// //Any routes will be redirected to the angular app
// app.get('*', function (req, res) {
//   res.sendFile(path.join(__dirname, 'my-app/dist/my-app/index.html'));
// });

app.use('', express.static(path.join(__dirname, 'dist/my-app')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/my-app/index.html'));
});

const PORT = process.env.API_ENDPOINT || 8080;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
