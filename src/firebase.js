import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCblwRWxZH2nRLZivP63G4xvAf6r3luSPc",
  authDomain: "ratemyuni-f3bcf.firebaseapp.com",
  projectId: "ratemyuni-f3bcf",
  storageBucket: "ratemyuni-f3bcf.appspot.com",
  messagingSenderId: "878063317452",
  appId: "1:878063317452:web:87c639eff57652d5caed69"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };