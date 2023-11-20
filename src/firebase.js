// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBiZVv7HwmK_U0PtfX4RIZBan8rgDzg150",
  authDomain: "geosense-397309.firebaseapp.com",
  databaseURL: "https://geosense-397309-default-rtdb.firebaseio.com",
  projectId: "geosense-397309",
  storageBucket: "geosense-397309.appspot.com",
  messagingSenderId: "514158165439",
  appId: "1:514158165439:web:90e4e81a4a9981c99bb50a"
};

// Initialize Firebase
const fbapp = initializeApp(firebaseConfig);

export default fbapp;