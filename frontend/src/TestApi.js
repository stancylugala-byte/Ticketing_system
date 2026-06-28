import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TestApi() {
  const [message, setMessage] = useState('Loading...');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Test the backend API
    axios.get('/api/test')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(err => {
        setError('Failed to connect to backend');
        console.error(err);
      });
  }, []);

  return (
    <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #61dafb' }}>
      <h2>Backend Connection Test</h2>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <p style={{ color: 'lightgreen' }}>✅ {message}</p>
      )}
    </div>
  );
}

export default TestApi;