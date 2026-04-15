import React, { useState } from 'react';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        name: name,
        email: email,
        createdAt: new Date(),
      });
      alert("Astra Identity Created! Welcome " + name);
      navigate("/"); 
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Orbitron, sans-serif' }}>
      <div style={{ border: '2px solid #60a5fa', padding: '40px', borderRadius: '15px', boxShadow: '0 0 20px #1e3a8a', textAlign: 'center', background: '#050505' }}>
        <h1 style={{ color: '#60a5fa', marginBottom: '30px', letterSpacing: '3px' }}>NEW_IDENTITY_v7</h1>
        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' }}>
          <input type="text" placeholder="ENTER_FULL_NAME" onChange={(e) => setName(e.target.value)} style={{ padding: '12px', borderRadius: '5px', border: '1px solid #1e3a8a', background: '#0a0a0a', color: '#fff' }} required />
          <input type="email" placeholder="ENTER_EMAIL" onChange={(e) => setEmail(e.target.value)} style={{ padding: '12px', borderRadius: '5px', border: '1px solid #1e3a8a', background: '#0a0a0a', color: '#fff' }} required />
          <input type="password" placeholder="CREATE_SECURE_PIN" onChange={(e) => setPassword(e.target.value)} style={{ padding: '12px', borderRadius: '5px', border: '1px solid #1e3a8a', background: '#0a0a0a', color: '#fff' }} required />
          <button type="submit" style={{ padding: '12px', backgroundColor: '#60a5fa', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>INITIALIZE_REGISTRATION</button>
        </form>
        <p style={{ marginTop: '20px', fontSize: '12px' }}>
          <Link to="/" style={{ color: '#888', textDecoration: 'none' }}>RETURN_TO_GATE</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;