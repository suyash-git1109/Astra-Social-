import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const [feeds, setFeeds] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState({ name: 'USER' });
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) setUserData({ name: user.displayName || "Astra User" });

    // Users ko load karne ka logic
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubUsers();
  }, []);

  useEffect(() => {
    const colName = selectedUser ? "private_messages" : "broadcasts";
    const q = query(collection(db, colName), orderBy("timestamp", "desc"));
    const unsubMsgs = onSnapshot(q, (snap) => {
      let data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (selectedUser) {
        data = data.filter(m => 
          (m.sender === userData.name && m.receiver === selectedUser.name) ||
          (m.sender === selectedUser.name && m.receiver === userData.name)
        );
      }
      setFeeds(data);
    });
    return () => unsubMsgs();
  }, [selectedUser, userData.name]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    await addDoc(collection(db, selectedUser ? "private_messages" : "broadcasts"), {
      text: message,
      sender: userData.name,
      receiver: selectedUser ? selectedUser.name : "GLOBAL",
      timestamp: serverTimestamp(),
    });
    setMessage("");
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', display: 'flex', fontFamily: 'monospace' }}>
      {/* SIDEBAR */}
      <div style={{ width: '250px', borderRight: '1px solid #222', padding: '20px', background: '#050505' }}>
        <h3 style={{ color: '#60a5fa' }}>ASTRA_NODES</h3>
        <div onClick={() => setSelectedUser(null)} style={{ padding: '10px', cursor: 'pointer', color: !selectedUser ? '#0f0' : '#888' }}># GLOBAL_FEED</div>
        {users.filter(u => u.name !== userData.name).map(u => (
          <div key={u.id} onClick={() => setSelectedUser(u)} style={{ padding: '10px', cursor: 'pointer', color: selectedUser?.id === u.id ? '#60a5fa' : '#ccc' }}>● {u.name}</div>
        ))}
        <button onClick={() => signOut(auth).then(() => navigate('/'))} style={{ marginTop: '20px', color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>LOGOUT</button>
      </div>

      {/* CHAT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' }}>
        <h2>{selectedUser ? `PRIVATE: ${selectedUser.name}` : "GLOBAL_BROADCAST"}</h2>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {feeds.map(f => (
            <div key={f.id} style={{ margin: '10px 0', textAlign: f.sender === userData.name ? 'right' : 'left' }}>
              <div style={{ display: 'inline-block', padding: '10px', borderRadius: '10px', background: f.sender === userData.name ? '#60a5fa' : '#111', color: f.sender === userData.name ? '#000' : '#fff' }}>
                <small style={{ display: 'block', fontSize: '10px' }}>{f.sender}</small>{f.text}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
          <input value={message} onChange={e => setMessage(e.target.value)} style={{ flex: 1, padding: '15px', background: '#0a0a0a', color: '#fff', border: '1px solid #333' }} placeholder="Type..." />
          <button type="submit" style={{ padding: '0 20px', background: '#fff' }}>SEND</button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;