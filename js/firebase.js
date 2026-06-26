import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCSKhuHLQtiNfEbPOhdQBZtkHroXztFXL8",
  authDomain: "absensi-tentor-c8c11.firebaseapp.com",
  databaseURL: "https://absensi-tentor-c8c11-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "absensi-tentor-c8c11",
  storageBucket: "absensi-tentor-c8c11.firebasestorage.app",
  messagingSenderId: "698859040974",
  appId: "1:698859040974:web:f4fd3635de261f1c9e609f",
  measurementId: "G-00VP2FW3GT"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);