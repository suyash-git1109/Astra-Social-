import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [message, setMessage] = useState('');
  const [feeds, setFeeds] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Private chat ke liye
  const [userData, setUserData] = useState({ name: 'CONTRIBUTOR', initial: 'A' });
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const displayName = user.displayName || user.email.split('@')[0].toUpperCase();
      setUserData({ name: displayName, initial: displayName.charAt(0) });
    }

    // Saare Users ko Load Karo
    const getUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    getUsers();
  }, []);

  // Message Listener (Dynamic: Global or Private)
  useEffect(() => {
    let collectionName = selectedUser ? "private_messages" : "broadcasts";
    const q = query(collection(db, collectionName), orderBy("timestamp", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Agar private hai toh filter karo
      if (selectedUser) {
        data = data.filter(m => 
          (m.sender === userData.name && m.receiver === selectedUser.name) ||
          (m.sender === selectedUser.name && m.receiver === userData.name)
        );
      }
      setFeeds(data);
    });
    return () => unsubscribe();
  }, [selectedUser, userData.name]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    try {
      const collectionName = selectedUser ? "private_messages" : "broadcasts";
      await addDoc(collection(db, collectionName), {
        text: message,
        sender: userData.name,
        receiver: selectedUser ? selectedUser.name : "GLOBAL",
        user: userData.name, // compatibility ke liye
        timestamp: serverTimestamp(),
      });
      setMessage("");
    } catch (error) { console.error(error); }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', display: 'flex', fontFamily: 'monospace' }}>
      
      {/* SIDEBAR: ACTIVE NODES */}
      <div style={{ width: '250px', borderRight: '1px solid #222', padding: '20px', backgroundColor: '#050505' }}>
        <h3 style={{ fontSize: '12px', color: '#60a5fa', letterSpacing: '2px' }}>ACTIVE_NODES</h3>
        <div 
          onClick={() => setSelectedUser(null)} 
          style={{ padding: '10px', cursor: 'pointer', color: !selectedUser ? '#00ff00' : '#888', borderBottom: '1px solid #111' }}
        >
          # GLOBAL_BROADCAST
        </div>
        {users.filter(u => u.name !== userData.name).map(u => (
          <div 
            key={u.id} 
            onClick={() => setSelectedUser(u)}
            style={{ padding: '10px', cursor: 'pointer', color: selectedUser?.id === u.id ? '#60a5fa' : '#eee' }}
          >
            ● {u.name}
          </div>
        ))}
        <button onClick={() => signOut(auth).then(() => navigate('/'))} style={{ marginTop: '20px', color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>LOGOUT</button>
      </div>

      {/* MAIN CHAT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' }}>
        <header style={{ borderBottom: '1px solid #222', paddingBottom: '10px', marginBottom: '20px' }}>
          <h2>{selectedUser ? `PRIVATE: ${selectedUser.name}` : "GLOBAL_BROADCAST_FEED"}</h2>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {feeds.map(f => (
            <div key={f.id} style={{ padding: '10px', borderRadius: '10px', backgroundColor: f.sender === userData.name ? '#111' : '#0a0a0a', alignSelf: f.sender === userData.name ? 'flex-end' : 'flex-start', maxWidth: '70%', border: '1px solid #222' }}>
              <span style={{ fontSize: '9px', color: '#60a5fa' }}>{f.sender || f.user}</span>
              <p style={{ margin: '5px 0 0 0' }}>{f.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <input 
            value={message} onChange={e => setMessage(e.target.value)}
            placeholder={selectedUser ? `Message ${selectedUser.name}...` : "Broadcast to Nexus..."}
            style={{ flex: 1, padding: '15px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#0a0a0a', color: '#fff' }}
          />
          <button type="submit" style={{ padding: '0 30px', borderRadius: '10px', backgroundColor: '#fff', color: '#000', fontWeight: 'bold' }}>SEND</button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;