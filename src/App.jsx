iimport React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div style={{background: '#000', color: '#60a5fa', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>ASTRA_CONNECTING...</div>;

  return (
    <Router>
      <Routes>
        {/* Agar user login hai to Dashboard pe bhejo, nahi to Login pe */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;