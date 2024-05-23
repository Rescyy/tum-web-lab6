import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import Home from './Home';
import AddWallet from './AddWallet';
import WalletDetail from './wallet/WalletDetail';
import EasyWalletLogo from './assets/easywallet.png'; // Adjust the path as needed
import './App.css';
import axios from 'axios';

const Header = ({ toggleDarkMode, darkMode }) => {
  const history = useHistory();

  const handleClick = () => {
    history.push('/');
  };

  return (
    <div className={`header ${darkMode ? 'dark-mode' : ''}`}>
      <img src={EasyWalletLogo} onClick={handleClick} alt="Easy Wallet Logo"/>
      <button onClick={toggleDarkMode}>
        Toggle {darkMode ? 'Light' : 'Dark'} Mode
      </button>
    </div>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchToken = () => {
    
    axios.post('http://127.0.0.1:5000/api/token', {
      username: 'testuser',
      permissions: ['READ', 'WRITE']
    })
    .then(response => {
      setToken(response.data.access_token);
      setLoading(false);
    })
    .catch(error => {
      console.error("Error fetching token: ", error);
      setLoading(false);
    });

  };

  useEffect(() => {
    fetchToken();
    setDarkMode(localStorage.getItem('darkMode') === 'true');
  }, []);

  const toggleDarkMode = () => {
    localStorage.setItem('darkMode', !darkMode);
    setDarkMode(!darkMode);
  };

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      {loading ? ( // Show a loading state while fetching the token
          <div>Loading...</div>
        ) : (
          <Switch>
            <Route exact path="/">
              <Home darkMode={darkMode} token={token} />
            </Route>
            <Route path="/addwallet">
              <AddWallet token={token}/>
            </Route>
            <Route path="/wallet/:id">
              <WalletDetail token={token}/>
            </Route>
          </Switch>
        )}
        <div className="footer"></div>
      </div>
    </Router>
  );
}

export default App;