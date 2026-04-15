import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom'; // Ye zaruri hai pages switch karne ke liye

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("CEO Sahab, Access Granted!");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ border: '2px solid #1e3a8a', padding: '40px', borderRadius: '15px', boxShadow: '0 0 20px #1e3a8a', textAlign: 'center' }}>
        <h1 style={{ color: '#60a5fa', marginBottom: '30px', letterSpacing: '3px' }}>ASTRA_GATE</h1>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' }}>
          <input type="email" placeholder="IDENTITY_EMAIL" onChange={(e) => setEmail(e.target.value)} style={{ padding: '12px', borderRadius: '5px', border: '1px solid #1e3a8a', background: '#0a0a0a', color: '#fff' }} />
          <input type="password" placeholder="ACCESS_KEY" onChange={(e) => setPassword(e.target.value)} style={{ padding: '12px', borderRadius: '5px', border: '1px solid #1e3a8a', background: '#0a0a0a', color: '#fff' }} />
          <button type="submit" style={{ padding: '12px', backgroundColor: '#60a5fa', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>INITIALIZE_SESSION</button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '12px', color: '#888' }}>
          NEW USER? <Link to="/signup" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 'bold' }}>CREATE IDENTITY</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;