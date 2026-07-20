import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBSMqGBHr9NrdDFgzTUkq2JO1bYbMK1wPY",
  authDomain: "sdgs-uno.firebaseapp.com",
  projectId: "sdgs-uno",
  storageBucket: "sdgs-uno.firebasestorage.app",
  messagingSenderId: "746123533673",
  appId: "1:746123533673:web:bbf50b6e29ba97a49e71f8",
  measurementId: "G-TK0EQECN59"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export { doc, setDoc, getDoc, updateDoc, onSnapshot, serverTimestamp };

export function ensureSignedIn() {
  return new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      if (user) {
        resolve(user);
      } else {
        signInAnonymously(auth)
          .then((cred) => resolve(cred.user))
          .catch(reject);
      }
    });
  });
}
