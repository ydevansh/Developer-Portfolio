import React from 'react';
import ReactDOM from 'react-dom/client';
import * as THREE from 'three';
import App from './App.jsx';

// Polyfill Three.js 0.185 missing constants for postprocessing & 3D libraries
try {
  if (THREE && typeof THREE === 'object') {
    if (!('sRGBEncoding' in THREE)) {
      Object.defineProperty(THREE, 'sRGBEncoding', { value: 3001, configurable: true, writable: true });
    }
    if (!('LinearEncoding' in THREE)) {
      Object.defineProperty(THREE, 'LinearEncoding', { value: 3000, configurable: true, writable: true });
    }
  }
} catch (err) {
  console.warn('THREE polyfill skipped:', err);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

