import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import Home from './Home';
import AddWallet from './AddWallet';
import WalletDetail from './wallet/WalletDetail';
import EasyWalletLogo from './assets/easywallet.png'; // Adjust the path as needed
import './App.css';

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

  useEffect(() => {
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
        <Switch>
          <Route exact path="/">
            <Home darkMode={darkMode}/>
          </Route>
          <Route path="/addwallet">
            <AddWallet/>
          </Route>
          <Route path="/wallet/:id">
            <WalletDetail/>
          </Route>
        </Switch>
        <div className="footer"></div>
      </div>
    </Router>
  );
}

export default App;