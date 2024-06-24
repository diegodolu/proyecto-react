import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Obtiene la instancia de Auth
const auth = getAuth(app);

// Obtiene la instancia de Database
const db = getDatabase(app);

export { auth, db , signOut};