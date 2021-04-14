import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/App';
import { StoreProvider } from './contexts/store';
import './index.css';

if (process.env.REACT_APP_ENV !== 'cto') {
  require('bootstrap/dist/css/bootstrap.min.css');
  require('@fortawesome/fontawesome-free/css/all.min.css');
}

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
