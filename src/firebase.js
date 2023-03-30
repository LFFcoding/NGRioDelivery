import firebase from "firebase";

const firebaseApp = firebase.initializeApp({

    apiKey: "AIzaSyDm7tkB2AYYLkms2v9Q2hF3YEt0FVWHXi0",
  
    authDomain: "ngriodelivery-2cab6.firebaseapp.com",
  
    projectId: "ngriodelivery-2cab6",
  
    storageBucket: "ngriodelivery-2cab6.appspot.com",
  
    messagingSenderId: "677814655576",
  
    appId: "1:677814655576:web:cb5b3346d74dc5e98bc82d"
  
});

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};