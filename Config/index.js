// Import the functions you need from the SDKs you need
import app from "firebase/compat/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/firestore';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALgb_TeRJ5sh1DTLf8IFuAWiyjtu1PYmU",
  authDomain: "whatsappclone-41e72.firebaseapp.com",
  projectId: "whatsappclone-41e72",
  storageBucket: "whatsappclone-41e72.firebasestorage.app",
  messagingSenderId: "403065706030",
  appId: "1:403065706030:web:b52e2b09a83a8f6d8531bf",
  measurementId: "G-ZNLFY60QRH"
};

// Initialize Firebase
const firebase = app.initializeApp(firebaseConfig);
export default firebase;