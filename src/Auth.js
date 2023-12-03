// Auth.js
import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const Auth = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Check for user information in localStorage on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user);
        // Save user information in localStorage
        localStorage.setItem('user', JSON.stringify(user));
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user);
        // Save user information in localStorage
        localStorage.setItem('user', JSON.stringify(user));
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        // Remove user information from localStorage on sign-out
        localStorage.removeItem('user');
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  return (
    <div>
      {auth.currentUser ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <div>
          {/* Sign-in and sign-up UI */}
          <label>Email: </label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <br />
          <label>Password: </label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <br />
          <button onClick={handleSignIn}>Sign In</button>
          <button onClick={handleSignUp}>Sign Up</button>
        </div>
      )}
    </div>
  );
};

export default Auth;
