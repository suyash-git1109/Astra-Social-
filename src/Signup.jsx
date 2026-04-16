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
      // 1. Firebase Auth mein account banao
      const userCredential = await createUserWithEmailAndPassword(auth, email, pin);
      const user = userCredential.user;

      // 2. Profile mein naam set karo
      await updateProfile(user, { displayName: name });

      // 3. Firestore ke 'users' collection mein record save karo (YE ZAROORI HAI)
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        status: "ACTIVE_NODE"
      });

      alert("Identity Created Successfully!");
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'monospace' }}>
      <form onSubmit={handleSignup} style={{ border: '1px solid #333', padding: '40px', borderRadius: '20px', textAlign: 'center', background: '#050505' }}>
        <h2 style={{ letterSpacing: '5px' }}>CREATE_IDENTITY</h2>
        <input type="text" placeholder="FULL_NAME" onChange={(e) => setName(e.target.value)} style={{ display: 'block', margin: '20px auto', padding: '10px', width: '100%', background: '#000', border: '1px solid #222', color: '#fff' }} required />
        <input type="email" placeholder="EMAIL_ADDRESS" onChange={(e) => setEmail(e.target.value)} style={{ display: 'block', margin: '20px auto', padding: '10px', width: '100%', background: '#000', border: '1px solid #222', color: '#fff' }} required />
        <input type="password" placeholder="SECURE_PIN" onChange={(e) => setPin(e.target.value)} style={{ display: 'block', margin: '20px auto', padding: '10px', width: '100%', background: '#000', border: '1px solid #222', color: '#fff' }} required />
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#60a5fa', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>INITIALIZE_IDENTITY</button>
      </form>
    </div>
  );
};

export default Signup;