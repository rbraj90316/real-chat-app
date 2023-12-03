import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { signOut } from 'firebase/auth'; // Import signOut function

const Chat = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Initialize Firestore
  const db = getFirestore();

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

  const handleSignOut = () => {
    // Assuming you have access to the auth object
    // and it is passed down as a prop or through context
  
    // Example:
    auth.signOut()
      .then(() => {
        // Sign-out successful.
        setUser(null); // Update the user state to null or handle it according to your logic
      })
      .catch((error) => {
        // An error happened.
        console.error(error.message);
      });
  };
  

  return (
    <div className="ChatWindow">
      <div className="UserHeader">
        <div className="UserIcon">
          {user && user.email && (
            <span className="UserInitial">{user.email[0].toUpperCase()}</span>
          )}
        </div>
        <div className="UserInfo">
          {user && user.email && (
            <div className="UserName">{user.email}</div>
          )}
          <button className="btn btn-secondary" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>
      <h1 className="text-center font-weight-bold mb-4">Chat with Your Friend Now</h1>
      <div className="MessageArea">
        {messages.map((message) => (
          <div key={message.id} className={`Message alert alert-primary ${message.sender === user.email ? 'user' : 'other'}`}>
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
  );
};

export default Chat;
