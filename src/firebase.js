import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCE_rugedit2krNZbfm7gk_GZ-EnTwhJqc",
  authDomain: "dashboard-hitalo.firebaseapp.com",
  projectId: "dashboard-hitalo",
  storageBucket: "dashboard-hitalo.appspot.com",
  messagingSenderId: "1072079724638",
  appId: "1:1072079724638:web:21668afd4d4dd87decd4cf",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { onAuthStateChanged };
