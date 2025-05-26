import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAfxS9jPAdS4VQx3WGGjPWGEm9qRyASCwA",
  authDomain: "fir-dcc1d.firebaseapp.com",
  projectId: "fir-dcc1d",
  storageBucket: "fir-dcc1d.appspot.com",
  messagingSenderId: "426936003898",
  appId: "1:426936003898:web:af35766b766200ebb1b403",
  measurementId: "G-M9D8M45SF5",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
