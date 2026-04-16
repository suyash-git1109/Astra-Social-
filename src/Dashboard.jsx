import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const [feeds, setFeeds] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Get Current User Info
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserData({
        name: user.displayName || 'CONTRIBUTOR',
        initial: user.displayName ? user.displayName.charAt(0) : 'A'
      });
    }
  }, []);

  // Real-time Feed Listener
  useEffect(() => {
    const q = query(collection(db, "broadcasts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFeeds(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

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
      console.error("Error sending message: ", error);
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => navigate('/'));
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'monospace', padding: '20px' }}>
      
      {/* HEADER / PROFILE CARD */}
      <div style={{ maxWidth: '600px', margin: '0 auto', border: '1px solid #333', borderRadius: '20px', padding: '30px', textAlign: 'center', background: 'linear-gradient(145deg, #0a0a0a, #111)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', margin: '0 auto 15px', border: '4px solid #60a5fa' }}>
          {userData?.initial}
        </div>
        <h2 style={{ letterSpacing: '3px', margin: '10px 0' }}>{userData?.name}</h2>
        <p style={{ color: '#00ff00', fontSize: '12px', marginBottom: '20px' }}>● SYSTEM_ACTIVE / {userData?.name === 'SUYASH' ? 'ADMIN' : 'CONTRIBUTOR'}</p>
        <button onClick={handleLogout} style={{ backgroundColor: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '10px' }}>TERMINATE_SESSION</button>
      </div>

      {/* BROADCAST INPUT */}
      <div style={{ maxWidth: '600px', margin: '30px auto', display: 'flex', gap: '10px' }}>
        <input 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Broadcast to Astra Nexus..." 
          style={{ flex: 1, padding: '15px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#0a0a0a', color: '#fff', outline: 'none' }}
        />
        <button onClick={handleSend} style={{ padding: '0 30px', borderRadius: '10px', border: 'none', backgroundColor: '#fff', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>SEND</button>
      </div>

      {/* LIVE FEED */}
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '12px', color: '#666', marginBottom: '15px', textAlign: 'center', letterSpacing: '2px' }}>GLOBAL_BROADCAST_FEED</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {feeds.map((feed) => (
            <div key={feed.id} style={{ border: '1px solid #222', padding: '15px', borderRadius: '12px', backgroundColor: '#050505' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#60a5fa', marginBottom: '8px' }}>
                <span>{feed.user}</span>
                <span>{feed.timestamp?.toDate().toLocaleTimeString()}</span>
              </div>
              <p style={{ fontSize: '14px', lineHeight: '1.5', margin: 0 }}>{feed.text}</p>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ textAlign: 'center', marginTop: '50px', padding: '20px', color: '#444', fontSize: '10px' }}>
        ASTRA_NEXUS_SYSTEM // AMBEJOGAI_NODE <br/>
        <span style={{ color: '#60a5fa', fontSize: '12px', marginTop: '10px', display: 'block' }}>DEVELOPED BY SUYASH SALUNKE</span>
      </footer>
    </div>
  );
};

export default Dashboard;