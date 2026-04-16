import React, { useState } from 'react';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pin);
      await updateProfile(userCredential.user, { displayName: name });
      
      // Database mein user ka record banana
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: name,
        email: email,
        status: "ACTIVE"
      });

      alert("Astra ID Created! Login karo aur sidebar dekho.");
      navigate('/');
    } catch (error) { alert(error.message); }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={handleSignup} style={{ width: '320px', padding: '30px', border: '1px solid #60a5fa', background: '#050505', borderRadius: '15px' }}>
        <h2 style={{ textAlign: 'center', color: '#60a5fa' }}>ASTRA_SIGNUP</h2>
        
        {/* INPUT 1: NAME */}
        <input type="text" placeholder="Full Name" onChange={(e) => setName(e.target.value)} 
          style={{ width: '100%', padding: '12px', margin: '10px 0', background: '#111', color: '#fff', border: '1px solid #333' }} required />
        
        {/* INPUT 2: EMAIL (Ye missing tha pehle) */}
        <input type="email" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} 
          style={{ width: '100%', padding: '12px', margin: '10px 0', background: '#111', color: '#fff', border: '1px solid #333' }} required />
        
        {/* INPUT 3: PIN */}
        <input type="password" placeholder="Secure Pin" onChange={(e) => setPin(e.target.value)} 
          style={{ width: '100%', padding: '12px', margin: '10px 0', background: '#111', color: '#fff', border: '1px solid #333' }} required />
        
        <button type="submit" style={{ width: '100%', padding: '12px', background: '#60a5fa', color: '#000', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>
          REGISTER_NOW
        </button>
      </form>
    </div>
  );
};

export default Signup;