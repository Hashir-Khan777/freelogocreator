// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjGW9BF-l39-sdfXpXvv0ryGHnl_lizjM",
  authDomain: "online-education-system-27677.firebaseapp.com",
  projectId: "online-education-system-27677",
  storageBucket: "online-education-system-27677.appspot.com",
  messagingSenderId: "745255987202",
  appId: "1:745255987202:web:09a4bb63ba24d68e9a1f1b",
  measurementId: "G-DVRXM32WVE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const database = getAuth(app);

export default app;
