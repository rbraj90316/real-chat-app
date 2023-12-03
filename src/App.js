// App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import Auth from './Auth'; // Import the Auth component
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Initialize Firestore
  const db = getFirestore();

  useEffect(() => {
    // Listen for authentication state changes
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Listen for chat messages
    const messagesCollection = collection(db, 'messages');
    const unsubscribe = onSnapshot(messagesCollection, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [db]);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      // Add a new message to Firestore
      const messagesCollection = collection(db, 'messages');
      await addDoc(messagesCollection, {
        text: newMessage,
        sender: user.email, // Assuming you have authentication and the user has an email
        timestamp: new Date(),
      });

      setNewMessage('');
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center align-items-center vh-100">
        <div className="col-md-6 mt-5 mb-5">
          {user ? (
            <div className="ChatWindow">
              <h1 className="text-center font-weight-bold mb-4">Chat with Your Friend Now</h1>
              <div className="MessageArea">
                {messages.map((message) => (
                  <div key={message.id} className={`Message alert alert-primary ${message.sender}`}>
                    <div className="MessageText">{message.text}</div>
                    <div className="Timestamp">{message.timestamp.toDate().toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <div className="InputArea input-group mb-3">
                <label htmlFor="messageInput" className="sr-only">
                  Type your message...
                </label>
                <input
                  type="text"
                  id="messageInput"
                  className="form-control"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <div className="input-group-append">
                  <button className="btn btn-primary" type="button" onClick={handleSendMessage}>
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Display the Auth component for non-authenticated users
            <Auth setUser={setUser} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
