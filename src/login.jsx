import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ border: '2px solid #1e3a8a', padding: '40px', borderRadius: '15px', textAlign: 'center' }}>
        <h1 style={{ color: '#60a5fa', marginBottom: '30px' }}>ASTRA_GATE</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' }}>
          <input type="email" placeholder="IDENTITY_ID" onChange={(e) => setEmail(e.target.value)} style={{ padding: '12px', background: '#0a0a0a', color: '#fff', border: '1px solid #1e3a8a' }} />
          <input type="password" placeholder="SECURE_PIN" onChange={(e) => setPassword(e.target.value)} style={{ padding: '12px', background: '#0a0a0a', color: '#fff', border: '1px solid #1e3a8a' }} />
          <button type="submit" style={{ padding: '12px', backgroundColor: '#60a5fa', color: '#000', fontWeight: 'bold' }}>LOGIN</button>
        </form>
        <p style={{ marginTop: '20px' }}>
          NEW? <Link to="/signup" style={{ color: '#60a5fa', fontWeight: 'bold' }}>CREATE_IDENTITY</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;