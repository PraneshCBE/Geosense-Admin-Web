// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import 'firebase/messaging';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBNTVOafNR4RyVnikINYJfG_9-Duv_qds",
  authDomain: "jovial-beach-397310.firebaseapp.com",
  databaseURL: "https://jovial-beach-397310-default-rtdb.firebaseio.com",
  projectId: "jovial-beach-397310",
  storageBucket: "jovial-beach-397310.appspot.com",
  messagingSenderId: "592898026656",
  appId: "1:592898026656:web:b486da82cc59b6df5badc5",
  measurementId: "G-YSVFFXZY20"
};

// Initialize Firebase
const fbapp = initializeApp(firebaseConfig);
export default fbapp