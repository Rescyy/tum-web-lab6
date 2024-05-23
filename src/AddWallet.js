import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // To generate unique IDs
import './AddWallet.css'; // Ensure you have this import
import {useHistory } from 'react-router-dom';
import axios from 'axios';

const AddWallet = ({token}) => {
    const [walletName, setWalletName] = useState('');
    const [walletCurrency, setWalletCurrency] = useState("None"); 
    const [walletDescription, setWalletDescription] = useState(''); 
    const history = useHistory();

    const handleNameChange = (event) => {
        setWalletName(event.target.value);
    };

    const handleCurrencyChange = (event) => {
        setWalletCurrency(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setWalletDescription(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
        if (walletCurrency === 'None') {
            return;
        }

        const walletId = uuidv4();

        axios.post("http://localhost:5000/api/wallets/" + walletId,
            {
                name: walletName,
                currency: walletCurrency,
                description: walletDescription
            },
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        ).then(() => {history.push('/')}).catch((error) => {console.error("Error creating wallet ", error)});
    };

    return (
        <div>
            <h1>Add Wallet</h1>
            <form onSubmit={handleSubmit}>
                <div className='add-wallet-field'>
                    <label>
                        Name:
                        <input 
                            type="text" 
                            value={walletName} 
                            onChange={handleNameChange}
                            required
                        />
                    </label>
                </div>
                <div className='add-wallet-field'>
                    <label>
                        Currency:
                        <select 
                            value={walletCurrency} 
                            onChange={handleCurrencyChange}
                            required
                            defaultValue="None"
                        >
                            <option value="None">-</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        <div>Description:</div>
                        <textarea 
                            value={walletDescription} 
                            onChange={handleDescriptionChange}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Add Wallet</button>
            </form>
        </div>
    );
};

export default AddWallet;