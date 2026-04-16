import React, { useState } from 'react';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // Email state add ki
  const [pin, setPin] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      alert("Please enter a valid email!");
      return;
    }
    try {
      // 1. Firebase Auth mein account banao
      const userCredential = await createUserWithEmailAndPassword(auth, email, pin);
      const user = userCredential.user;

      // 2. Profile mein naam set karo
      await updateProfile(user, { displayName: name });

      // 3. Firestore mein record save karo
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        status: "ACTIVE_NODE"
      });

      alert("Astra Identity Created!");
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'monospace' }}>
      <form onSubmit={handleSignup} style={{ border: '1px solid #333', padding: '40px', borderRadius: '20px', background: '#050505', width: '350px' }}>
        <h2 style={{ letterSpacing: '5px', textAlign: 'center', color: '#60a5fa' }}>CREATE_ID</h2>
        
        <label style={{ fontSize: '10px', color: '#555' }}>NAME</label>
        <input type="text" placeholder="Full Name" onChange={(e) => setName(e.target.value)} style={{ display: 'block', margin: '5px 0 20px', padding: '12px', width: '100%', background: '#000', border: '1px solid #222', color: '#fff', borderRadius: '8px' }} required />
        
        <label style={{ fontSize: '10px', color: '#555' }}>EMAIL (Used for Login)</label>
        <input type="email" placeholder="email@astra.com" onChange={(e) => setEmail(e.target.value)} style={{ display: 'block', margin: '5px 0 20px', padding: '12px', width: '100%', background: '#000', border: '1px solid #222', color: '#fff', borderRadius: '8px' }} required />
        
        <label style={{ fontSize: '10px', color: '#555' }}>SECURE PIN (Password)</label>
        <input type="password" placeholder="******" onChange={(e) => setPin(e.target.value)} style={{ display: 'block', margin: '5px 0 20px', padding: '12px', width: '100%', background: '#000', border: '1px solid #222', color: '#fff', borderRadius: '8px' }} required />
        
        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#60a5fa', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', borderRadius: '8px', marginTop: '10px' }}>INITIALIZE_IDENTITY</button>
      </form>
    </div>
  );
};

export default Signup;