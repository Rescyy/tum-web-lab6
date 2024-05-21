import {useHistory } from 'react-router-dom';

const AddWallet = () => {
    const history = useHistory();

    const handleWalletClick = () => {
      history.push('/addwallet');
    };

    return (
        <div key="addwallet" className="wallet" onClick={handleWalletClick}>
          <h1>Add Wallet</h1>
        </div>
    )
}

export default AddWallet;