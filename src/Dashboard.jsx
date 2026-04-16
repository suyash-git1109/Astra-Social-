import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const [feeds, setFeeds] = useState([]);
  const [userData, setUserData] = useState({ name: 'CONTRIBUTOR', initial: 'A' });
  const navigate = useNavigate();

  // 1. User Data Load Karo
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // Agar Firebase Auth mein naam nahi hai toh 'DIPAK' ya 'SUYASH' default rakhte hain
      const displayName = user.displayName || 'SUYASH_SALUNKE'; 
      setUserData({
        name: displayName,
        initial: displayName.charAt(0).toUpperCase()
      });
    }
  }, []);

  // 2. Messages Real-time Fetch Karo
  useEffect(() => {
    const q = query(collection(db, "broadcasts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFeeds(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // 3. Message Send Karne ka Function
  const handleSend = async (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    try {
      await addDoc(collection(db, "broadcasts"), {
        text: message,
        user: userData.name,
        timestamp: serverTimestamp(),
      });
      setMessage("");
    } catch (error) {
      console.error("Error: ", error);
      alert("Database error! Check Firebase Rules.");
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => navigate('/'));
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'monospace', padding: '20px' }}>
      
      {/* HEADER / PROFILE SECTION */}
      <div style={{ maxWidth: '600px', margin: '0 auto', border: '1px solid #333', borderRadius: '25px', padding: '40px 20px', textAlign: 'center', background: 'linear-gradient(145deg, #050505, #111)', boxShadow: '0 0 20px rgba(96, 165, 250, 0.2)' }}>
        <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 'bold', margin: '0 auto 15px', border: '3px solid #60a5fa' }}>
          {userData.initial}
        </div>
        <h2 style={{ letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '5px' }}>{userData.name}</h2>
        <p style={{ color: '#00ff00', fontSize: '11px', marginBottom: '25px', letterSpacing: '1px' }}>● ASTRA_CORE_ACTIVE</p>
        <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '10px 25px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', transition: '0.3s' }}>TERMINATE_SESSION</button>
      </div>

      {/* INPUT BOX */}
      <div style={{ maxWidth: '600px', margin: '30px auto', display: 'flex', gap: '12px' }}>
        <input 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Broadcast to Astra Nexus..." 
          style={{ flex: 1, padding: '18px', borderRadius: '12px', border: '1px solid #333', backgroundColor: '#0a0a0a', color: '#fff', outline: 'none', fontSize: '14px' }}
        />
        <button onClick={handleSend} style={{ padding: '0 35px', borderRadius: '12px', border: 'none', backgroundColor: '#fff', color: '#000', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s' }}>SEND</button>
      </div>

      {/* FEED LIST */}
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <p style={{ fontSize: '10px', color: '#555', textAlign: 'center', letterSpacing: '3px', marginBottom: '20px' }}>GLOBAL_BROADCAST_FEED</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {feeds.map((feed) => (
            <div key={feed.id} style={{ border: '1px solid #1a1a1a', padding: '20px', borderRadius: '15px', backgroundColor: '#080808', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#60a5fa', marginBottom: '10px', fontWeight: 'bold' }}>
                <span>@{feed.user.split(' ')[0]}</span>
                <span style={{ color: '#444' }}>{feed.timestamp?.toDate().toLocaleTimeString()}</span>
              </div>
              <p style={{ fontSize: '15px', margin: 0, color: '#ddd', lineHeight: '1.6' }}>{feed.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ textAlign: 'center', marginTop: '60px', paddingBottom: '30px' }}>
        <p style={{ fontSize: '10px', color: '#333', letterSpacing: '2px' }}>ASTRA_NEXUS_v2 // NODE_AMBEJOGAI</p>
        <p style={{ color: '#60a5fa', fontSize: '13px', fontWeight: 'bold', marginTop: '5px' }}>DEVELOPED BY SUYASH SALUNKE</p>
      </footer>
    </div>
  );
};

export default Dashboard;