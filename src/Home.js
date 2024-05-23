import React, { useState, useEffect } from 'react';
import Wallet from './wallet/Wallet';
import AddWallet from './wallet/AddWallet';
import axios from 'axios';

const Home = ({darkMode, token}) => {
  const [wallets, setWallets] = useState([]);
  const [renderToggle, setRenderToggle] = useState(false);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/wallets/all", {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    .then(response => {
      setWallets(response.data.wallets);
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    });
  }, []);

  const handleDeleteWallet = (id, index) => {
    console.log(wallets);
    wallets.splice(index, 1);
    axios.delete("http://127.0.0.1:5000/api/wallets/" + id, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
    console.log(wallets);
    setWallets(wallets);
    setRenderToggle(!renderToggle);
  }

  const renderWallet = (wallet, index) => {
    return (
      <Wallet key={wallet.id} wallet={wallet} darkMode={darkMode} deleteHandle={handleDeleteWallet} index={index}/>
    );
  };


  const separateWallets = () => {

    const walletRows = [];
    for (let i = 0; i <= wallets.length; i += 3) {

      const walletRow = [];

      if (i + 3 > wallets.length) {

        for (let j = i; j < wallets.length; j++) {
          walletRow.push(renderWallet(wallets[j], j))
        }
        walletRow.push(
          <AddWallet/>
        )
        walletRow.push(
          <div className="invisible-wallet"/>
        )
      } else {
        for (let j = i; j < i + 3; j++) {
          walletRow.push(renderWallet(wallets[j], j));
        }
      }

      walletRows.push(
        <div className="wallet-row">
          {walletRow}
        </div>
      );
    }

    return walletRows;
  }

  return (
    <div>
      <h1>My Wallets</h1>
      <div className="wallets">
        {separateWallets()}
      </div>
    </div>
  );
}

export default Home;