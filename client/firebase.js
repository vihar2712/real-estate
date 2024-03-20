// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  //   import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-85cca.firebaseapp.com",
  projectId: "mern-estate-85cca",
  storageBucket: "mern-estate-85cca.appspot.com",
  messagingSenderId: "90292848475",
  appId: "1:90292848475:web:b3c5778a5c1b3512b6fc7e",
  measurementId: "G-J7WJ25GMHQ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
