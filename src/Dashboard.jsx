import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, query, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';

const Dashboard = () => {
  const [users, setUsers] = useState([]); // Duniya bhar ke users yahan aayenge
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // 1. Saare Users ko Firebase se khichna
  useEffect(() => {
    const q = query(collection(db, "users")); 
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // 2. Global Messages load karna
  useEffect(() => {
    const q = query(collection(db, "broadcasts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    await addDoc(collection(db, "broadcasts"), {
      text: newMessage,
      user: auth.currentUser.email,
      createdAt: serverTimestamp(),
    });
    setNewMessage("");
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#000', color: '#fff', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR: ALL REGISTERED USERS */}
      <div style={{ width: '260px', borderRight: '1px solid #1e3a8a', padding: '20px', background: '#050505', overflowY: 'auto' }}>
        <h3 style={{ color: '#60a5fa', fontSize: '14px', marginBottom: '20px', letterSpacing: '2px' }}>GLOBAL_USERS</h3>
        {users.map(u => (
          <div key={u.id} style={{ padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px' }}>👤 {u.email.split('@')[0]}</span>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#60a5fa' }}>📞</button>
          </div>
        ))}
      </div>

      {/* CHAT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' }}>
        <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>ASTRA_GLOBAL_FEED</h2>
        
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', border: '1px solid #111', padding: '15px', borderRadius: '10px' }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ marginBottom: '15px', padding: '10px', background: '#0a0a0a', borderRadius: '5px' }}>
              <small style={{ color: '#3b82f6' }}>{msg.user}</small>
              <p style={{ margin: '5px 0' }}>{msg.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px' }}>
          <input 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a global message..." 
            style={{ flex: 1, padding: '12px', borderRadius: '5px', background: '#111', border: '1px solid #1e3a8a', color: '#fff' }} 
          />
          <button type="submit" style={{ padding: '10px 25px', background: '#60a5fa', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '5px' }}>SEND</button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;