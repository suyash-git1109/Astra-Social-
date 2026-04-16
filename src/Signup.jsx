
   
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
      
      // Database entry for User Directory
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: name,
        email: email,
        status: "ONLINE"
      });

      alert("Astra Identity Verified!");
      navigate('/');
    } catch (error) { alert(error.message); }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'monospace' }}>
      <form onSubmit={handleSignup} style={{ width: '320px', padding: '30px', border: '1px solid #60a5fa', background: '#050505', borderRadius: '15px', boxShadow: '0 0 20px rgba(96, 165, 250, 0.2)' }}>
        <h2 style={{ textAlign: 'center', color: '#60a5fa', letterSpacing: '3px' }}>CREATE_NODE</h2>
        
        <input type="text" placeholder="FULL NAME" onChange={(e) => setName(e.target.value)} 
          style={{ width: '100%', padding: '12px', margin: '10px 0', background: '#000', color: '#fff', border: '1px solid #222', borderRadius: '5px' }} required />
        
        <input type="email" placeholder="EMAIL ADDRESS" onChange={(e) => setEmail(e.target.value)} 
          style={{ width: '100%', padding: '12px', margin: '10px 0', background: '#000', color: '#fff', border: '1px solid #222', borderRadius: '5px' }} required />
        
        <input type="password" placeholder="SECURE PIN" onChange={(e) => setPin(e.target.value)} 
          style={{ width: '100%', padding: '12px', margin: '10px 0', background: '#000', color: '#fff', border: '1px solid #222', borderRadius: '5px' }} required />
        
        <button type="submit" style={{ width: '100%', padding: '12px', background: '#60a5fa', color: '#000', fontWeight: 'bold', cursor: 'pointer', border: 'none', borderRadius: '5px', marginTop: '10px' }}>
          INITIALIZE_IDENTITY
        </button>
      </form>
    </div>
  );
};

export default Signup;