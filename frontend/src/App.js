import React from 'react';
import './App.css';
import TestApi from './TestApi';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>🎫 Ticketing System</h1>
        <p>React Frontend is running!</p>
        <TestApi />
      </header>
    </div>
  );
}

export default App;