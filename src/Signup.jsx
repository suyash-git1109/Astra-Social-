import React, { useState } from 'react';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pin);
      await updateProfile(res.user, { displayName: name });
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        name: name,
        email: email,
        status: "ACTIVE"
      });
      alert("Astra Identity Initialized!");
      navigate('/');
    } catch (err) { alert(err.message); }
  };

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={handleSignup} style={{ width: '320px', padding: '30px', border: '1px solid #60a5fa', background: '#050505', borderRadius: '15px' }}>
        <h2 style={{ textAlign: 'center', color: '#60a5fa' }}>ASTRA_GATE</h2>
        <input type="text" placeholder="FULL NAME" onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '12px', margin: '10px 0', background: '#111', color: '#fff', border: '1px solid #333' }} required />
        <input type="email" placeholder="EMAIL ADDRESS" onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', margin: '10px 0', background: '#111', color: '#fff', border: '1px solid #333' }} required />
        <input type="password" placeholder="SECURE PIN" onChange={(e) => setPin(e.target.value)} style={{ width: '100%', padding: '12px', margin: '10px 0', background: '#111', color: '#fff', border: '1px solid #333' }} required />
        <button type="submit" style={{ width: '100%', padding: '12px', background: '#60a5fa', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>INITIALIZE_NODE</button>
      </form>
    </div>
  );
}