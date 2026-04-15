import React, { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ye check karega ki user logged in hai ya nahi
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div style={{backgroundColor: '#000', color: '#60a5fa', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Astra Loading...</div>;
  }

  return (
    <div className="App">
      {/* Agar user login hai to Dashboard dikhega, warna Login page */}
      {user ? <Dashboard /> : <Login />}
    </div>
  );
}

export default App;