import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import './Wallet.css';
import threeDotsImage from '../assets/threedots.png'; // Assume you have this image in your project
import darkThreeDotsImage from '../assets/threedots-dark.png';

const Wallet = ({ wallet, darkMode, deleteHandle, index }) => {
    const history = useHistory();
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const handleWalletClick = () => {
        history.push('/wallet/' + wallet.id);
    };

    const handleThreeDotsClick = (event) => {
        event.stopPropagation();
        setDropdownVisible(!dropdownVisible);
    };

    const handleDeleteWallet = (event) => {
        event.stopPropagation();
        deleteHandle(wallet.id, index);
        setDropdownVisible(false);
    }

    return (
        <div className="wallet" onClick={handleWalletClick}>
            <div className="wallet-content">
                <h1>{wallet.name}</h1>
            </div>
            <div className="three-dots">
                <img src={darkMode ? darkThreeDotsImage : threeDotsImage} alt="More options" onClick={handleThreeDotsClick}/>
                {dropdownVisible && (
                    <div className="dropdown-menu">
                        <button onClick={handleDeleteWallet}>Delete Wallet</button>
                    </div>
                )}
            </div>
        </div>
    );
};


export default Wallet;