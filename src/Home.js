import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

const Home = () => {
  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    const storedWallets = JSON.parse(localStorage.getItem('wallets')) || [];
    setWallets(storedWallets);
  }, []);

  return (
    <div>
      <h1>My Wallets</h1>
      <div className="wallet-container">
        {wallets.map((wallet, index) => (
          <div key={index} className="wallet">
            <h2>{wallet.name}</h2>
            <p>Total: {wallet.total}</p>
          </div>
        ))}
        <div key={wallets.length} className="wallet">
          
        </div>
      </div>
    </div>
  );
}

export default Home;