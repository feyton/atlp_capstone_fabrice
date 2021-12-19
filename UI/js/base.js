// import { checkEmail } from "./signup.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  child,
  get,
  getDatabase,
  push,
  ref as databaseRef,
  set,
  update,
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
    localStorage.setItem("currentUserId", user.uid);
    handleUserLoggedIn(user);
  } else {
    handleUserLoggedOut();
  }
});

export const notifyUser = (message, type = "primary", duration = 3000) => {
  Toastify({
    text: message,
    duration: duration,
    stopOnFocus: true,
    close: true,
    className: type,
  }).showToast();
};

export function handleUserSignUpError(code) {
  console.log(code);
  notifyUser(code, "danger", 3000);
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
  // TO-Do
  //Adding ability to load user data from database
}
function checkSubEmail(email) {
  var emailRegex = /\S+@\S+\.\S+/;
  if (email.match(emailRegex)) {
    return true;
  }
  return false;
}

$(".sub-form").on("submit", (e) => {
  e.preventDefault();
  let email = e.target.querySelector("input").value;
  // console.log(email);
  if (email == "") {
  } else {
    if (checkSubEmail(email)) {
      let subRef = push(child(databaseRef(database), "subscribers/")).key;
      /**TO-DO
       * Ensure email uniqueness to avoid double entries
       *
       */
      //To do making sure that email does not exist in the database
      set(databaseRef(database, "subscribers/" + subRef + "/"), {
        email: email,
      });
      notifyUser("Thank you! You will start to receive our newsletter");
      $(".sub-form").trigger("reset");
    } else {
      notifyUser("Fill the form with valid email", "danger");
    }
  }
});

$(".social-icons i").click((e) => {
  // To avoid turning all icons into url,
  let link = e.target.getAttribute("data-link");
  window.open(link, "_blank");
});

onAuthStateChanged(auth, (user) => {
  if (user && window.location.pathname == "/UI/pages/profile.html") {
    renderUserInfo(user);
  }
});

const renderUserInfo = (user) => {
  // console.log(user);
  let userRef = child(databaseRef(database), "users/" + user.uid);
  let data;
  get(userRef)
    .then((snapshot) => {
      data = snapshot.val();
      console.log(data);
      let divData = `
  
      <div class="info">
          <span>Name:</span> <span class="">${data.name}</span>
      </div>
      <div class="info">
          <span>Facebook:</span> <span class="">${data.facebook}</span>
      </div>
      <div class="info">
          <span>Twitter:</span> <span class="">${data.twitter}</span>
      </div>
      <div class="info bio">
          <span>Bio:</span> <span class="">${data.bio}</span>
      </div>
      `;

      $(".user-info-render").html(divData);
      $("#profile-name").val(data.name);
      if (data.facebook != undefined) {
        $("#profile-facebook").val(data.facebook);
      }
      if (data.twitter != undefined) {
        $("#profile-twitter").val(data.twitter);
      }
      if (data.bio != undefined) {
        $("#profile-bio").val(data.bio);
      }
    })
    .catch((err) => {});
};

$(".btn-update-profile").click((e) => {
  e.preventDefault();
  $(".update-div").toggle(200);
});

$("#update-profile-form").submit((e) => {
  e.preventDefault();
  let user = auth.currentUser;
  let userRef = child(databaseRef(database), "users/" + user.uid);

  let name, facebook, twitter, bio;
  name = $("#profile-name").val();
  facebook = $("#profile-facebook").val();
  twitter = $("#profile-twitter").val();
  bio = $("#profile-bio").val();
  let profileData = {
    displayName: name,
  };
  let customData = {
    name: name,
    facebook: facebook,
    twitter: twitter,
    bio: bio,
  };
  console.log(customData);
  updateProfile(user, profileData);
  update(userRef, customData)
    .then(() => {
      console.log("Updated profile");
    })
    .catch((error) => {
      console.log(error);
    });

  notifyUser("Your profile has been updated");
  setTimeout(() => {
    window.location.reload();
  }, 3000);
});
