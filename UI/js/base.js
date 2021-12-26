// import { checkEmail } from "./signup.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@8/src/sweetalert2.js";
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

export const resolvePathname = (path) => {
  let host = window.location.host;
  let local = "127.0.0.1";
  let gitPages = "feyton.github.io";
  let localUI = window.location.pathname.split("/")[1];

  if (host.startsWith(local) && !localUI == "UI") {
    return path;
  } else if (localUI == "UI") {
    return "/UI" + path;
  } else if (host.startsWith(gitPages)) {
    let newPath = "atpl_capstone_fabrice" + path;
    return newPath;
  }
};
export const handleUserLoggedIn = (user) => {
  // Handling a change in authentication when a user log or logout
  let loggedIn = document.querySelectorAll(".logged-in");
  let loggedOut = document.querySelectorAll(".logged-out");
  let profilePicture = document.querySelectorAll(".profile-picture");
  loggedIn.forEach((element) => {
    element.style.display = "block";
  });
  loggedOut.forEach((element) => {
    element.style.display = "none";
  });
  profilePicture.forEach((element) => {
    element.src = user.photoURL;
  });
  let userNameField = document.querySelectorAll(".user-name");
  try {
    userNameField.forEach((element) => {
      element.innerHTML = user.displayName.split(" ")[0];
    });
  } catch (error) {
    userNameField.forEach((element) => {
      element.innerHTML = user.displayName;
    });
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
  let loggedIn = document.querySelectorAll(".logged-in");
  let loggedOut = document.querySelectorAll(".logged-out");
  loggedIn.forEach((element) => {
    element.style.display = "none";
  });
  loggedOut.forEach((element) => {
    element.style.display = "block";
  });
  // renderHome();
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    localStorage.setItem("currentUserId", user.uid);
    handleUserLoggedIn(user);
  } else {
    handleUserLoggedOut();
  }
});

export const notifyUser = (message, type = "success", duration = 3000) => {
  Swal.fire({
    html: message,
    timer: duration,
    timerProgressBar: true,
    icon: type,
  });
};

export const handleUserSignUpError = (code) => {
  console.log(code);
  notifyUser(code, "danger", 3000);
};

export const askUserConfirmation = () => {
  Swal.fire({});
};

$(".user-logout-button").click((e) => {
  e.preventDefault();
  Swal.fire({
    title: "Are you sure?",
    html: "You will be logged out!",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, log me out!",
  }).then((result) => {
    console.log(result.value);
    if (result.value == true) {
      auth.signOut();
      notifyUser("You have successfully logged out", "warning", 3000);
      handleUserLoggedOut();
    } else {
      notifyUser("Action cancelled");
    }
  });
});
export let loggedOutPath = [
  resolvePathname("/pages/signup.html"),
  resolvePathname("/pages/login.html"),
];
export let loggedInPath = [""];
export function renderHome() {
  // window.location.href = "/UI/";
  let home = ["/UI/", "/UI/index.html", resolvePathname("/index.html")];
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
  if (
    host == resolvePathname("/pages/signup.html") ||
    host == resolvePathname("/pages/login.html")
  ) {
    console.log("Matched");

    onAuthStateChanged(auth, (user) => {
      if (user) {
        notifyUser("You should not be here.", "error");
        setTimeout(() => {
          window.location.pathname = resolvePathname("/index.html");
        }, 3000);
      }
    });
  }
}
try {
  handleLoading();
} catch (error) {}

export function createUserProfile(user, data) {
  let userRef = push(child(databaseRef(database), "users/" + user.uid));
  set(databaseRef(database, "users/" + user.uid), data);
  console.log("Profile created");
}

export function getUserData(uid) {
  // TO-Do
  //Adding ability to load user data from database
}
export const checkSubEmail = (email) => {
  const emailRegex = /\S+@\S+\.\S+/;
  if (email.match(emailRegex)) {
    return true;
  }
  return false;
};

let subForms = document.querySelectorAll(".sub-form");
subForms.forEach((form) => {
  form.addEventListener("submit", (e) => {
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
        form.reset();
      } else {
        notifyUser("Fill the form with valid email", "danger");
      }
    }
  });
});
// $(".sub-form").on("submit", (e) => {
//   e.preventDefault();
//   let email = e.target.querySelector("input").value;
//   // console.log(email);
//   if (email == "") {
//   } else {
//     if (checkSubEmail(email)) {
//       let subRef = push(child(databaseRef(database), "subscribers/")).key;
//       /**TO-DO
//        * Ensure email uniqueness to avoid double entries
//        *
//        */
//       //To do making sure that email does not exist in the database
//       set(databaseRef(database, "subscribers/" + subRef + "/"), {
//         email: email,
//       });
//       notifyUser("Thank you! You will start to receive our newsletter");
//       $(".sub-form").trigger("reset");
//     } else {
//       notifyUser("Fill the form with valid email", "danger");
//     }
//   }
// });

$(".social-icons i").click((e) => {
  // To avoid turning all icons into url,
  let link = e.target.getAttribute("data-link");
  notifyUser("Clicked");
  // window.open(link, "_blank");
});

onAuthStateChanged(auth, (user) => {
  if (
    user &&
    window.location.pathname == resolvePathname("/pages/profile.html")
  ) {
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
