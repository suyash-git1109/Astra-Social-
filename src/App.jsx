
           import React, { useState, useEffect } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form, setForm] = useState({ username: '', password: '' });
  
  // Users Storage
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('astra_users');
    return saved ? JSON.parse(saved) : [{ user: 'suyash', pass: 'astra01', role: 'SYSTEM_CEO', pic: null }];
  });

  // Global Messages Storage
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('astra_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    localStorage.setItem('astra_users', JSON.stringify(users));
    localStorage.setItem('astra_messages', JSON.stringify(messages));
  }, [users, messages]);

  const handleAuth = (e) => {
    e.preventDefault();
    const inputUser = form.username.toLowerCase().trim();
    if (isSigningUp) {
      if (users.find(u => u.user === inputUser)) return alert("ID EXISTS");
      const newUser = { user: inputUser, pass: form.password, role: 'CONTRIBUTOR', pic: null };
      setUsers([...users, newUser]);
      setIsSigningUp(false);
      alert("ID CREATED!");
    } else {
      const found = users.find(u => u.user === inputUser && u.pass === form.password);
      if (found) { setCurrentUser(found); setIsLoggedIn(true); }
      else alert("WRONG CREDENTIALS");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedUsers = users.map(u => u.user === currentUser.user ? { ...u, pic: reader.result } : u);
        setUsers(updatedUsers);
        setCurrentUser({ ...currentUser, pic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const sendBroadcast = () => {
    if (!newMessage.trim()) return;
    const msgObj = {
      id: Date.now(),
      sender: currentUser.user,
      text: newMessage,
      role: currentUser.role,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([msgObj, ...messages]);
    setNewMessage("");
  };

  if (!isLoggedIn) {
    return (
      <div style={{ background: '#020617', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}>
        <div style={{ padding: '40px', background: 'rgba(10, 10, 10, 0.8)', border: '2px solid #3b82f6', borderRadius: '15px', width: '380px', textAlign: 'center', boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)' }}>
          <h2 style={{ color: '#60a5fa', letterSpacing: '5px' }}>ASTRA_GATE</h2>
          <form onSubmit={handleAuth} style={{ marginTop: '20px' }}>
            <input type="text" placeholder="IDENTITY_ID" required value={form.username} onChange={(e) => setForm({...form, username: e.target.value})} style={{ width: '100%', padding: '15px', marginBottom: '15px', background: '#000', border: '1px solid #3b82f6', color: '#60a5fa', outline: 'none', borderRadius: '8px' }} />
            <input type="password" placeholder="SECURE_PIN" required value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} style={{ width: '100%', padding: '15px', marginBottom: '25px', background: '#000', border: '1px solid #3b82f6', color: '#60a5fa', outline: 'none', borderRadius: '8px' }} />
            <button type="submit" style={{ width: '100%', padding: '15px', background: 'linear-gradient(45deg, #3b82f6, #06b6d4)', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', borderRadius: '8px' }}>{isSigningUp ? 'REGISTER_NOW' : 'INITIALIZE_SESSION'}</button>
          </form>
          <p onClick={() => setIsSigningUp(!isSigningUp)} style={{ color: '#94a3b8', marginTop: '20px', cursor: 'pointer', fontSize: '12px' }}>{isSigningUp ? 'BACK TO LOGIN' : 'NEW USER? CREATE IDENTITY'}</p>
          <div style={{ marginTop: '40px', borderTop: '1px solid rgba(59, 130, 246, 0.2)', paddingTop: '20px' }}>
            <p style={{ color: '#60a5fa', fontSize: '14px', fontWeight: 'bold', letterSpacing: '3px', textShadow: '0 0 10px #3b82f6' }}>DEVELOPED BY SUYASH SALUNKE</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', color: 'white', fontFamily: 'monospace', position: 'relative' }}>
      
      {/* Profile Card */}
      <div style={{ background: '#0a0a0a', border: '1px solid #3b82f6', borderRadius: '20px', width: '100%', maxWidth: '500px', padding: '30px', textAlign: 'center', marginBottom: '30px', boxShadow: '0 0 40px rgba(59, 130, 246, 0.1)' }}>
        <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 15px' }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: currentUser.pic ? `url(${currentUser.pic}) center/cover` : 'linear-gradient(45deg, #3b82f6, #06b6d4)', border: '2px solid #3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', overflow: 'hidden' }}>
            {!currentUser.pic && currentUser.user[0].toUpperCase()}
          </div>
          <label style={{ position: 'absolute', bottom: '0', right: '0', background: '#3b82f6', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #000' }}>
            <span style={{ fontSize: '18px' }}>+</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
          </label>
        </div>
        <h2 style={{ color: '#60a5fa', textTransform: 'uppercase', marginBottom: '5px' }}>{currentUser.user}</h2>
        <div style={{ color: '#22c55e', fontSize: '11px', fontWeight: 'bold' }}>● {currentUser.role}</div>
        <button onClick={() => setIsLoggedIn(false)} style={{ marginTop: '20px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 20px', borderRadius: '5px', cursor: 'pointer', fontSize: '10px' }}>TERMINATE_SESSION</button>
      </div>

      {/* Broadcast Box - Cleaned Up */}
      <div style={{ width: '100%', maxWidth: '500px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="text" placeholder="Broadcast to Astra Nexus..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} style={{ flex: 1, background: '#000', border: '1px solid #3b82f6', padding: '15px', borderRadius: '10px', color: '#fff', outline: 'none', boxShadow: 'inset 0 0 5px rgba(59, 130, 246, 0.2)' }} />
          <button onClick={sendBroadcast} style={{ background: 'linear-gradient(45deg, #3b82f6, #06b6d4)', color: 'white', border: 'none', padding: '0 25px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '1px' }}>SEND</button>
        </div>
      </div>

      {/* Global Wall Feed - Glassmorphism & Glow */}
      <div style={{ width: '100%', maxWidth: '500px', background: 'rgba(10, 10, 10, 0.6)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '25px', border: '1px solid rgba(59, 130, 246, 0.3)', boxShadow: '0 0 30px rgba(59, 130, 246, 0.1)', marginBottom: '100px' }}>
        <h3 style={{ fontSize: '12px', color: '#60a5fa', marginBottom: '20px', letterSpacing: '2px', textAlign: 'center', textShadow: '0 0 5px #3b82f6' }}>GLOBAL_BROADCAST_FEED</h3>
        <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', paddingRight: '10px' }}>
          {messages.length === 0 && <p style={{ color: '#475569', textAlign: 'center', fontSize: '12px' }}>NO_BROADCASTS_YET</p>}
          {messages.map(msg => (
            <div key={msg.id} style={{ 
              padding: '15px', background: 'rgba(0, 0, 0, 0.5)', borderRadius: '12px', 
              border: msg.role === 'SYSTEM_CEO' ? '1px solid #3b82f6' : '1px solid #1e293b',
              boxShadow: msg.role === 'SYSTEM_CEO' ? '0 0 15px rgba(59, 130, 246, 0.2)' : 'none',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: msg.role === 'SYSTEM_CEO' ? '#60a5fa' : '#94a3b8', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {msg.sender} {msg.role === 'SYSTEM_CEO' && '✓'}
                </span>
                <span style={{ color: '#475569', fontSize: '10px' }}>{msg.time}</span>
              </div>
              <p style={{ color: msg.role === 'SYSTEM_CEO' ? '#fff' : '#cbd5e1', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>{msg.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PREMIUM GLOWING FOOTER */}
      <div style={{ position: 'fixed', bottom: '0', left: '0', width: '100%', background: 'linear-gradient(to top, #020617, transparent)', padding: '20px 0', textAlign: 'center', borderTop: '1px solid rgba(59, 130, 246, 0.1)' }}>
        <p style={{ color: '#60a5fa', fontSize: '16px', fontWeight: 'bold', letterSpacing: '4px', textShadow: '0 0 15px #3b82f6, 0 0 5px #3b82f6', margin: 0 }}>DEVELOPED BY SUYASH SALUNKE</p>
        <p style={{ color: '#1e293b', fontSize: '10px', marginTop: '5px' }}>ASTRA_NEXUS_SYSTEM // AMBEJOGAI_NODE</p>
      </div>

    </div>
  );
}

export default App;