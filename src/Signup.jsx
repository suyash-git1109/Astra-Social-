import React, { useState } from 'react';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // 1. Firebase Auth mein user banana
      const res = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Firestore Database mein user ki entry karna (taaki sidebar mein dikhe)
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        name: name,
        email: email,
        createdAt: new Date(),
      });

      alert("Astra Identity Created! Ab Login karo.");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#60a5fa', textShadow: '0 0 10px #60a5fa' }}>CREATE ASTRA IDENTITY</h1>
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' }}>
        <input type="text" placeholder="Full Name" onChange={(e) => setName(e.target.value)} style={{ padding: '12px', borderRadius: '5px', border: '1px solid #60a5fa', background: '#111', color: '#fff' }} required />
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} style={{ padding: '12px', borderRadius: '5px', border: '1px solid #60a5fa', background: '#111', color: '#fff' }} required />
        <input type="password" placeholder="Create Password" onChange={(e) => setPassword(e.target.value)} style={{ padding: '12px', borderRadius: '5px', border: '1px solid #60a5fa', background: '#111', color: '#fff' }} required />
        <button type="submit" style={{ padding: '12px', backgroundColor: '#60a5fa', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>JOIN ASTRA</button>
      </form>
      <p style={{ marginTop: '15px', fontSize: '12px' }}>Already have an identity? <a href="/" style={{ color: '#60a5fa' }}>Login</a></p>
    </div>
  );
};

export default Signup;