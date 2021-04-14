import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/App';
import { StoreProvider } from './contexts/store';
import { Container } from 'react-bootstrap';
import './index.css';

if (process.env.REACT_APP_ENV !== 'cto') {
  require('bootstrap/dist/css/bootstrap.min.css');
  require('@fortawesome/fontawesome-free/css/all.min.css');
}

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      {process.env.REACT_APP_ENV !== 'cto' ? (
        <Container className="mt-3 mb-3">
          <App />
        </Container>
      ) : (
        <App />
      )}
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
