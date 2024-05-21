import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import './WalletDetail.css';

const WalletDetail = () => {
  const { id } = useParams();
  const [storedWallets, setStoredWallets] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [newRow, setNewRow] = useState(null);

  useEffect(() => {
    const storedWallets = JSON.parse(localStorage.getItem('wallets')) || {};
    setWallet(storedWallets[id]);
    setStoredWallets(storedWallets);
  }, [id]);

  if (!wallet) {
    return <div>Wallet not found</div>;
  }

  const addRow = () => {
    const newRow = {
      nr: wallet.walletTransactions.length + 1,
      date: new Date().toLocaleString(),
      reason: '',
      amount: '',
    };
    setNewRow(newRow);
  };

  const confirmRow = (event) => {
    event.preventDefault();
    newRow.amount = parseFloat(newRow.amount);
    wallet.walletTransactions.push(newRow);
    storedWallets[id] = wallet;
    localStorage.setItem('wallets', JSON.stringify(storedWallets));
    setNewRow(null);
  };

  const cancelRow = () => {
    setNewRow(null);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRow({
      ...newRow,
      [name]: value,
    });
  };

  const getCurrentRows = () => {
    
    const transactionRows = [];
    var total = 0;

    for (var i = 0; i < wallet.walletTransactions.length; i++) {
      const transaction = wallet.walletTransactions[i];
      total += transaction.amount;
      transactionRows.push(
        <tr key={transaction.nr}>
          <td>{transaction.nr}</td>
          <td>{transaction.reason}</td>
          <td>{transaction.date}</td>
          <td className={transaction.amount > 0 ? "green-text" : "red-text"}>{(transaction.amount > 0 ? '+' : '') +  transaction.amount}</td>
          <td>{total}</td>
        </tr>
      )
    }

    wallet.balance = total;
    return transactionRows;
  }

  return (
    <div>
      <div>
        <h1>{wallet.name}</h1>
        <p>Balance: {wallet.balance}</p>
        <p>Currency: {wallet.currency}</p>
        <p>Description: {wallet.description}</p>
        {/* Add more details as needed */}
      </div>
      <form onSubmit={confirmRow}>
        <h2>
          Transaction Table
        </h2>
        <div className="table-container">
          <table border="1" cellPadding="10" cellSpacing="0">
            <thead>
              <th>Nr.</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Total</th>
            </thead>
            <tbody>
              {getCurrentRows()}
              {newRow && (
                <tr>
                <td>{newRow.nr}</td>
                <td>
                  <input
                    type="text"
                    name="reason"
                    value={newRow.reason}
                    onChange={handleInputChange}
                    />
                </td>
                <td>{newRow.date}</td>

                <td>
                  <input
                    type="number"
                    name="amount"
                    value={newRow.amount}
                    onChange={handleInputChange}
                    required
                    />
                </td>
                <td/>
              </tr>
            )}
            </tbody>
          </table>
        </div>
        {newRow ? (
          <div>
              <button type="submit">
                Confirm
              </button>
              <button onClick={cancelRow}>
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={addRow}>
              Add Row
            </button>
          )}
      </form>
      </div>
  );
};

export default WalletDetail;