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
  const [me, setMe] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser) setMe(auth.currentUser.displayName || "User");
    
    // Real-time Users List
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
          (m.sender === me && m.receiver === selectedUser.name) ||
          (m.sender === selectedUser.name && m.receiver === me)
        );
      }
      setFeeds(data);
    });
    return () => unsubMsgs();
  }, [selectedUser, me]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    await addDoc(collection(db, selectedUser ? "private_messages" : "broadcasts"), {
      text: message,
      sender: me,
      receiver: selectedUser ? selectedUser.name : "GLOBAL",
      timestamp: serverTimestamp(),
    });
    setMessage("");
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', display: 'flex', fontFamily: 'monospace' }}>
      {/* SIDEBAR */}
      <div style={{ width: '250px', borderRight: '1px solid #222', padding: '20px', background: '#050505' }}>
        <h4 style={{ color: '#60a5fa' }}>ASTRA_NODES</h4>
        <div onClick={() => setSelectedUser(null)} style={{ padding: '10px', cursor: 'pointer', color: !selectedUser ? '#0f0' : '#888', borderBottom: '1px solid #111' }}># GLOBAL_FEED</div>
        {users.filter(u => u.name !== me).map(u => (
          <div key={u.id} onClick={() => setSelectedUser(u)} style={{ padding: '12px 10px', cursor: 'pointer', color: selectedUser?.id === u.id ? '#60a5fa' : '#ccc', borderBottom: '1px solid #111' }}>● {u.name}</div>
        ))}
        <button onClick={() => signOut(auth).then(() => navigate('/'))} style={{ marginTop: '20px', color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '10px' }}>[ DISCONNECT ]</button>
      </div>

      {/* CHAT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' }}>
        <h3 style={{ color: '#60a5fa' }}>{selectedUser ? `>> PRIVATE_CHANNEL: ${selectedUser.name}` : ">> GLOBAL_BROADCAST"}</h3>
        <div style={{ flex: 1, overflowY: 'auto', margin: '20px 0', border: '1px solid #111', padding: '10px' }}>
          {feeds.map(f => (
            <div key={f.id} style={{ marginBottom: '15px', textAlign: f.sender === me ? 'right' : 'left' }}>
              <div style={{ display: 'inline-block', padding: '10px', borderRadius: '8px', background: f.sender === me ? '#60a5fa' : '#111', color: f.sender === me ? '#000' : '#fff' }}>
                <small style={{ display: 'block', fontSize: '9px', opacity: 0.7 }}>{f.sender}</small>
                {f.text}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
          <input value={message} onChange={e => setMessage(e.target.value)} style={{ flex: 1, padding: '15px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', outline: 'none' }} placeholder="Enter Command..." />
          <button type="submit" style={{ padding: '0 25px', background: '#fff', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>SEND</button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;