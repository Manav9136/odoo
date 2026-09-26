import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import { getAuth } from
  "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { getFirestore } from
  "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA3cr9vsZP25ZGsgk5Zz9Ev7y3NRHl9wj0",
    authDomain: "stocksense-64802.firebaseapp.com",
    projectId: "stocksense-64802",
    storageBucket: "stocksense-64802.firebasestorage.app",
    messagingSenderId: "981152146637",
    appId: "1:981152146637:web:624b31615e713110e57584",
    measurementId: "G-ONE9E4RMH9"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
