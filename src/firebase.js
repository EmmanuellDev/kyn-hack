// Import the necessary Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyAexGY-43MP6ZbYBV19wxRINHaYLUhOs28",
  authDomain: "kyn-reward.firebaseapp.com",
  projectId: "kyn-reward",
  storageBucket: "kyn-reward.appspot.com", // Make sure this points to the correct bucket
  messagingSenderId: "609720604006",
  appId: "1:609720604006:web:a32712ff0c01c06c1d24a7",
  measurementId: "G-XD8J1JSKVH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

// Export Firestore and Storage
export { db, storage, doc, updateDoc };
