// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZyUUG-IQQdBbF_uEujVh0qsCBQj2MvKI",
  authDomain: "real-chat-app-437a5.firebaseapp.com",
  projectId: "real-chat-app-437a5",
  storageBucket: "real-chat-app-437a5.appspot.com",
  messagingSenderId: "297186538680",
  appId: "1:297186538680:web:6162b4d40ce5b10a00704d",
  measurementId: "G-NNLFQ08PBP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
