import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDuKlY5Wq1Bt2ZSRzmM6iJfjfL6oB5VNKA",
  authDomain: "atlp-capstone.firebaseapp.com",
  databaseURL: "https://atlp-capstone-default-rtdb.firebaseio.com",
  projectId: "atlp-capstone",
  storageBucket: "atlp-capstone.appspot.com",
  messagingSenderId: "278628379823",
  appId: "1:278628379823:web:cd351b53e5071d8b68b85a",
  measurementId: "G-VYF1GZXQ5B",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getDatabase();
export const storage = getStorage();

console.log("Firebase loaded");

export const handleUserLoggedIn = (user) => {
  $(".logged-in").css("display", "block");
  $(".logged-out").css("display", "none");
  let message = `Welcome back, ${user.displayName}`;
  notifyUser(message, "primary", 4000);
};

export const handleUserLoggedOut = () => {
  $(".logged-in").css("display", "none");
  $(".logged-out").css("display", "block");
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    handleUserLoggedIn(user);
  } else {
    handleUserLoggedOut();
  }
});

export const notifyUser = (message, type = "primary", duration = 3000) => {
  $(".notify").text(message);
  $(".notify").addClass(type);
  $(".notify").removeClass("d-none");
  $(".animate-progress").css("animation-duration", duration);
  setTimeout(() => {
    $(".notify").text(message);
    $(".notify").removeClass(type);
    $(".notify").addClass("d-none");
  }, duration);
};

export function handleUserSignUpError(code) {
console.log(code)
}