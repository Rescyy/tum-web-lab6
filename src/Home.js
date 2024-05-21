import React, { useState, useEffect } from 'react';
import Wallet from './wallet/Wallet';
import AddWallet from './wallet/AddWallet';

const Home = ({darkMode}) => {
  const [wallets, setWallets] = useState([]);
  const [renderToggle, setRenderToggle] = useState(false);

  useEffect(() => {
    const storedWallets = JSON.parse(localStorage.getItem('wallets')) || [];
    setWallets(storedWallets);
  }, []);

  const handleDeleteWallet = (id) => {
    delete wallets[id];
    localStorage.setItem('wallets', JSON.stringify(wallets));
    setWallets(wallets);
    setRenderToggle(!renderToggle);
  }

  const renderWallet = (wallet) => {
    return (
      <Wallet key={wallet.id} wallet={wallet} darkMode={darkMode} deleteHandle={handleDeleteWallet}/>
    );
  };


  const separateWallets = (wallets) => {

    var walletList = [];

    for (var key in wallets) {
      walletList.push(wallets[key]);
    }

    wallets = walletList;

    const walletRows = [];
    for (let i = 0; i <= wallets.length; i += 3) {

      const walletRow = [];

      if (i + 3 > wallets.length) {

        for (let j = i; j < wallets.length; j++) {
          const wallet = wallets[j];
          walletRow.push(renderWallet(wallet, j - i))
        }
        walletRow.push(
          <AddWallet/>
        )
        walletRow.push(
          <div className="invisible-wallet"/>
        )
      } else {
        for (let j = i; j < i + 3; j++) {
          const wallet = wallets[j];
          walletRow.push(renderWallet(wallet, j - i));
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
        {separateWallets(wallets)}
      </div>
    </div>
  );
}

export default Home;