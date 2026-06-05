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

const refs = {
  saves: doc(db, "fmTracker", "saves"),
  squad: doc(db, "fmTracker", "squad"),
  people: doc(db, "fmTracker", "people"),
  notes: doc(db, "fmTracker", "notes"),
  links: doc(db, "fmTracker", "links"),
  extra: doc(db, "fmTracker", "extra")
};

async function saveToCloud(data) {
  await Promise.all([
    setDoc(refs.saves, { saves: data.saves || [] }),
    setDoc(refs.squad, { squad: data.squad || [] }),
    setDoc(refs.people, { people: data.people || [] }),
    setDoc(refs.notes, {
      notes: data.notes || [],
      todos: data.todos || [],
      playerNotes: data.playerNotes || []
    }),
    setDoc(refs.links, { links: data.links || [] }),
    setDoc(refs.extra, {
      lineup: data.lineup || {},
      theme: data.theme || "red",
      updatedAt: new Date().toISOString()
    })
  ]);
}

async function loadFromCloud() {
  const [savesSnap, squadSnap, peopleSnap, notesSnap, linksSnap, extraSnap] =
    await Promise.all([
      getDoc(refs.saves),
      getDoc(refs.squad),
      getDoc(refs.people),
      getDoc(refs.notes),
      getDoc(refs.links),
      getDoc(refs.extra)
    ]);

  return {
    ...(savesSnap.exists() ? savesSnap.data() : {}),
    ...(squadSnap.exists() ? squadSnap.data() : {}),
    ...(peopleSnap.exists() ? peopleSnap.data() : {}),
    ...(notesSnap.exists() ? notesSnap.data() : {}),
    ...(linksSnap.exists() ? linksSnap.data() : {}),
    ...(extraSnap.exists() ? extraSnap.data() : {})
  };
}

window.FMCloud = {
  saveToCloud,
  loadFromCloud
};

window.dispatchEvent(new Event("FMCloudReady"));

console.log("Firebase connected with split documents");
