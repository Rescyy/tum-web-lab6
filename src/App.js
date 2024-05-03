import React, { useState, useEffect} from "react";
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import axios from 'axios';
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" component={Home} />
      </Routes>
    </Router>
  )
}

function Home() {
  const [amount, setAmount] = useState(0);
  const [currencyFrom, setCurrencyFrom] = useState('USD');
  const [backCurrencyTo, setBackCurrencyTo] = useState('EUR');
  const [currencyTo, setCurrencyTo] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({});

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD`);
        setExchangeRates(response.data.rates);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchExchangeRates();
  }, [currencyFrom]);

  const convertCurrency = async () => {
    setCurrencyTo(backCurrencyTo);
    const convertedValue = (amount * exchangeRates[backCurrencyTo] / exchangeRates[currencyFrom]).toPrecision(4);
    setConvertedAmount(convertedValue);
  };

  return (
    <div className="App">
      <h1>Home</h1>
      <h2>Currency Converter</h2>
      <div>
        <label>
          Amount:
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          From:
          <select value={currencyFrom} onChange={(e) => {setCurrencyFrom(e.target.value);}}>
            {Object.keys(exchangeRates).map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          To:
          <select value={backCurrencyTo} onChange={(e) => setBackCurrencyTo(e.target.value)}>
            {Object.keys(exchangeRates).map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </label>
      </div>
      <button onClick={convertCurrency}>Convert</button>
      {convertedAmount && (
        <p>
          Converted Amount: {convertedAmount} {currencyTo}
        </p>
      )}
    </div>
  );
}

export default App;