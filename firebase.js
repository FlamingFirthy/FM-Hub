import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAsoxuUYzVGEv0X-Y2RZzyxykR6TwML0nE",
  authDomain: "fm-tracker-cffa3.firebaseapp.com",
  projectId: "fm-tracker-cffa3",
  storageBucket: "fm-tracker-cffa3.firebasestorage.app",
  messagingSenderId: "91704202117",
  appId: "1:91704202117:web:39f153564c5ce8ab922aec"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const mainSaveRef = doc(db, "fmTracker", "mainSave");

async function saveToCloud(data) {
  await setDoc(mainSaveRef, data);
}

async function loadFromCloud() {
  const snap = await getDoc(mainSaveRef);
  return snap.exists() ? snap.data() : null;
}

window.FMCloud = {
  saveToCloud,
  loadFromCloud
};

window.dispatchEvent(new Event("FMCloudReady"));

console.log("Firebase connected");