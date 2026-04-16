import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsub = onSnapshot(q, (snap) => {
      setUsers(snap.docs.map(doc => doc.data()));
    });
    return () => unsub();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#000', color: '#fff' }}>
      {/* SIDEBAR */}
      <div style={{ width: '250px', borderRight: '1px solid #222', padding: '20px' }}>
        <h3 style={{ color: '#60a5fa' }}>ASTRA_NODES</h3>
        {users.map((u, i) => (
          <div key={i} style={{ padding: '10px', borderBottom: '1px solid #111', color: '#ccc' }}>
            ● {u.name}
          </div>
        ))}
        <button onClick={() => signOut(auth).then(() => navigate('/'))} style={{ marginTop: '20px', color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>[LOGOUT]</button>
      </div>
      
      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: '40px' }}>
        <h1>Welcome, {auth.currentUser?.displayName || "Agent"}</h1>
        <p>Astra Social Protocol is active.</p>
      </div>
    </div>
  );
}