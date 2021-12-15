import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  child,
  get,
  getDatabase,
  push,
  ref as databaseRef,
  set,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
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
  $(".profile-picture").attr("src", user.photoURL);
  try {
    $(".user-name").text(user.displayName.split(" ")[0]);
    $(".profile-picture").attr("src", user.photoURL);
  } catch (error) {
    $(".user-name").text(user.displayName);
  }

  // console.log(user)
};
export const handleUserLoggedInFirstTime = (user) => {
  $(".logged-in").css("display", "block");
  $(".logged-out").css("display", "none");
  let message = `Welcome, ${user.displayName}`;
  notifyUser(message, "primary", 4000);
  renderHome();
};

export const handleUserLoggedOut = () => {
  $(".logged-in").css("display", "none");
  $(".logged-out").css("display", "block");
  renderHome();
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
  $(".animate-progress").css("animation-duration", duration / 1000 + "s");
  setTimeout(() => {
    $(".notify").text(message);
    $(".notify").removeClass(type);
    $(".notify").addClass("d-none");
  }, duration);
};

export function handleUserSignUpError(code) {
  console.log(code);
}

$(".user-logout-button").click((e) => {
  e.preventDefault();
  let logout = confirm("Are you sure to logout?");
  if (logout) {
    auth.signOut();
    handleUserLoggedOut();
    notifyUser("You have successfully logged out", "warning", 3000);
  }
});
export let loggedOutPath = ["/UI/pages/signup.html", "/UI/pages/login.html"];
export let loggedInPath = [""];
export function renderHome() {
  // window.location.href = "/UI/";
  let home = ["/UI/", "/UI/index.html"];
  let host = window.location.pathname;
  if (!home.includes(host)) {
    // console.log("Not home");
    // window.location.pathname = "/UI/";
    // onAuthStateChanged(auth, (user) => {
    //   if (user && loggedOutPath.includes(host)) {
    //     notifyUser("you should not be here.", "warning", 3000);
    //     setTimeout(() => {
    //       window.location.pathname = home[0];
    //     }, 3000);
    //   }
    // });
  } else {
    // console.log("Welcome home");
  }
}

function handleLoading() {
  let host = window.location.pathname;
  // let user = auth.currentUser;
  // console.log(host);
  if (host == "/UI/pages/signup.html") {
    console.log("Matched");

    onAuthStateChanged(auth, (user) => {
      if (user) {
        alert("You should not be here.");
        window.location.pathname = "/UI/";
      }
    });
  }
}

export function createUserProfile(user, data) {
  let userRef = push(child(databaseRef(database), "users/" + user.uid));
  set(databaseRef(database, "users/" + user.uid), data);
  console.log("Profile created");
}

export function getUserData(uid) {
  let userRef = databaseRef(database, "users/" + uid);
  get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot);
        return snapshot.val();
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
}
