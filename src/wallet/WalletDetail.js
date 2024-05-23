import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // To generate unique IDs
import './WalletDetail.css';
import axios from 'axios';

const WalletDetail = ({token}) => {
  const { id } = useParams();
  const [wallet, setWallet] = useState(null);
  const [newRow, setNewRow] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/wallets/" + id, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    .then(response => {
      setWallet(response.data);
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    });
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
    const transaction_id = uuidv4();
    axios.post("http://127.0.0.1:5000/api/wallets/" + id + "/transactions/" + transaction_id,
      {
        date: newRow.date,
        reason: newRow.reason,
        amount: newRow.amount
      },
      {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }
    )
    .then(() => {setNewRow(null)})
    .catch(error => {console.error("Error posting transaction ", error)});
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
          <td>{i+1}</td>
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