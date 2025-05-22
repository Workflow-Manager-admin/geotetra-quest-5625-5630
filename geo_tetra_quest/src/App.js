import React from 'react';
import './App.css';
import MainContainer from './components/MainContainer/MainContainer';

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> GeoTetra Quest
            </div>
          </div>
        </div>
      </nav>

      <main>
        <MainContainer />
      </main>
    </div>
  );
}

export default App;