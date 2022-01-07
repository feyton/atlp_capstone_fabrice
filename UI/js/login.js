import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { auth, handleUserLoggedIn, notifyUser } from "./base.js";

$(document).ready(() => {
  var inputs = document.querySelectorAll(".input");

  function focusFunc() {
    let parent = this.parentNode.parentNode;
    parent.classList.add("focus");
  }

  function blurFunc() {
    let parent = this.parentNode.parentNode;
    if (this.value == "") {
      parent.classList.remove("focus");
    }
  }
  function changeFunc() {
    let parent = this.parentNode.parentNode;
    if (this.value != "") {
      parent.classList.add("focus");
    }
  }

  inputs.forEach((input) => {
    input.addEventListener("focus", focusFunc);
    input.addEventListener("blur", blurFunc);
    input.addEventListener("change", changeFunc);
  });

  var checkForm = () => {
    var email = $("#user-email").val();
    var password = $("#user-password").val();

    if (email != null && password != null) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCreadential) => {
          let user = userCreadential.user;
          notifyUser(
            "Dear " + user.displayName + ", you have successfully logged in!"
          );
          window.location.href = "/UI/";
          handleUserLoggedIn(userCreadential.user);
        })
        .catch((err) => {
          console.log(err);
          notifyUser(err.message, "error", 3000);
        });
    }
  };

  $("#login-form").submit((e) => {
    e.preventDefault();
    checkForm();
  });
});
