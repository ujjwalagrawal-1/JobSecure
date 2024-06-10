import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

export const Context = createContext({
  isAuthorized: false,
  User : {},
  setAuthorized : () => {},
  setUser : () => {}
});

const AppWrapper = () => {
  const [isAuthorized, setAuthorized] = useState(false);
  const [User, setUser] = useState({});

  return (
    <Context.Provider value={{ isAuthorized, setAuthorized, User, setUser }}>
      <App />
    </Context.Provider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>,
);
