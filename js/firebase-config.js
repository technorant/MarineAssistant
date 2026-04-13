import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCQK4bQlq0Qhc3WPSjixG3bC70XtPNG1_0",
    authDomain: "marineassistant-25e60.firebaseapp.com",
    projectId: "marineassistant-25e60",
    storageBucket: "marineassistant-25e60.firebasestorage.app",
    messagingSenderId: "416035747696",
    appId: "1:416035747696:web:9b87b2fe74b08f78f3c1b5",
    measurementId: "G-GGHZMWSC5Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, analytics };
