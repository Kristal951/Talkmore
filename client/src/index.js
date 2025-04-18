import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
const clientID = process.env.REACT_APP_GOOGLE_CLIENT_ID

root.render(
  <GoogleOAuthProvider clientId={clientID}>
    <App />
  </GoogleOAuthProvider>
);
