import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAR1krUUYM16Yip9EDBMaZuLyW30tissgo",
  authDomain: "paragliding-account.firebaseapp.com",
  projectId: "paragliding-account",
  storageBucket: "paragliding-account.appspot.com",
  messagingSenderId: "790595167886",
  appId: "1:790595167886:web:6b97e7a0dc985b60f64bdf",
  measurementId: "G-0VX0VBKNBF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function salvaVolo(flightData) {
  flightData.createdAt = serverTimestamp();
  await addDoc(collection(db, "voli"), flightData);
}

export async function caricaDateVoli() {
  const voliRef = collection(db, "voli");
  const q = query(voliRef, orderBy("flightDate", "desc"));
  const snapshot = await getDocs(q);

  // Mappa date uniche a dati (ultimo volo per data)
  const dateMap = new Map();
  snapshot.forEach(doc => {
    const data = doc.data();
    dateMap.set(data.flightDate, { id: doc.id, ...data });
  });

  return Array.from(dateMap.entries()).map(([date, data]) => ({
    flightDate: date,
    ...data
  }));
}

export async function caricaVoloDaData(dataCercata) {
  const voliRef = collection(db, "voli");
  const q = query(voliRef, where("flightDate", "==", dataCercata), limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) throw new Error("Nessun volo trovato per questa data");
  return snapshot.docs[0].data();
}
