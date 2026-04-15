import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("CEO Sahab, Login Successful!");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#60a5fa', textShadow: '0 0 10px #60a5fa' }}>ASTRA LOGIN</h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' }}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #60a5fa', background: '#111', color: '#fff' }} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #60a5fa', background: '#111', color: '#fff' }} />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#60a5fa', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Enter Astra</button>
      </form>
    </div>
  );
};

export default Login;