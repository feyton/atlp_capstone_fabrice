import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  signInWithPopup,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytesResumable,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";
import {
  auth,
  createUserProfile,
  handleUserLoggedIn,
  handleUserSignUpError,
  notifyUser,
  storage,
} from "./base.js";
import { contentLoadingController } from "./index.js";
$(".input").each(function () {
  $(this).on("focus", function () {
    //   alert("focused");
    $(this).parent().next(".message-div").toggle(100, "linear");
  });
  $(this).on("blur", function () {
    $(this).parent().next(".message-div").toggle(100, "linear");
  });
});
let $confInput = $("#user-password-confirm");
// Email Validation
var emailValidation = () => {
  let $email = $("#user-email");
  // var emailValid = false;
  var emailRegex = /\S+@\S+\.\S+/;
  $email.on("keyup", () => {
    if ($email.val().match(emailRegex)) {
      $("#email-icon").addClass("valid");
      $("#email-valid").removeClass("invalid");
      $("#email-valid").addClass("valid");
      console.log("valid");
      // emailValid = true;
    } else {
      $("#email-icon").addClass("invalid");
      $("#email-valid").addClass("invalid");
      $("#email-valid").removeClass("valid");
      console.log("invalid");
    }
    // return emailValid;
  });
};

//   Form validation
var validatePassword = () => {
  var lowerCaseLetter = /[a-z]/g;
  var upperCaseLetter = /[A-Z]/g;
  var numbers = /[0-9]/g;
  // var passwordValid = false;
  $("#user-password").on("keyup", function () {
    $("#password-icon").addClass("invalid");
    //   console.log($(this).val());
    if ($(this).val().match(lowerCaseLetter)) {
      $("#lower-case-valid").removeClass("invalid");
      $("#lower-case-valid").addClass("valid");
    } else {
      $("#lower-case-valid").removeClass("valid");
      $("#lower-case-valid").addClass("invalid");
    }
    if ($(this).val().match(upperCaseLetter)) {
      $("#upper-case").removeClass("invalid");
      $("#upper-case").addClass("valid");
    } else {
      $("#upper-case").removeClass("valid");
      $("#upper-case").addClass("invalid");
    }
    if ($(this).val().match(numbers)) {
      $("#number").removeClass("invalid");
      $("#number").addClass("valid");
    } else {
      $("#number").removeClass("valid");
      $("#number").addClass("invalid");
    }

    if (
      $(this).val().match(lowerCaseLetter) &&
      $(this).val().match(upperCaseLetter) &&
      $(this).val().match(numbers) &&
      $(this).val().length >= 6
    ) {
      $("#password-icon").removeClass("invalid");
      $confInput.prop("disabled", false);
      // return true;
    } else {
      // return false;
    }
  });
};
function validatePasswordConfirm() {
  let $confInput = $("#user-password-confirm");
  let $pass = $("#user-password").val();

  $confInput.on("keyup", function () {
    if ($("#user-password").val() == $(this).val()) {
      // console.log($(this).val());
      // confirmPasswordValid = true;
      $("#password-confirm-icon").addClass("valid");
      $("#confirm-password-list").addClass("valid");
      $("#confirm-password-list").removeClass("invalid");
      $("#form-submit").prop("disabled", false);
      // return true;
    } else {
      console.log($(this).val());
      console.log($("#user-password").val());
      $("#password-confirm-icon").addClass("invalid");
      $("#password-confirm-icon").removeClass("valid");
      $("#confirm-password-list").addClass("invalid");
      $("#confirm-password-list").removeClass("valid");
      // return false;
    }
  });
}
validatePassword();
validatePasswordConfirm();
emailValidation();

function checkPass(pass) {
  var lowerCaseLetter = /[a-z]/g;
  var upperCaseLetter = /[A-Z]/g;
  var numbers = /[0-9]/g;
  if (
    pass.match(lowerCaseLetter) &&
    pass.match(upperCaseLetter) &&
    pass.match(numbers)
  ) {
    return true;
  }
  return false;
}

export function checkEmail(email) {
  var emailRegex = /\S+@\S+\.\S+/;
  if (email.match(emailRegex)) {
    return true;
  }
  return false;
}

const validateSignUpForm = () => {
  let password = $("#user-password").val();
  let email = $("#user-email").val();
  let name = $("#user-name").val();
  let image = $("#user-image")[0].files[0];

  if (checkEmail(email) && checkPass(password) && name.length >= 3) {
    console.log("Form is valid");
    submitData(name, email, password, image);
  } else {
    console.log("Invalid form");
  }
};

// Form Submission function

var submitData = (name, email, password, image) => {
  contentLoadingController();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      let user = userCredential.user;
      let profRef = storageRef(storage, "users/" + user.uid + "/profile.jpg");
      uploadBytesResumable(profRef, image)
        .then((snapshot) => {
          console.log("Profile picture uploaded");
          getDownloadURL(
            storageRef(storage, "users/" + user.uid + "/profile.jpg")
          )
            .then((url) => {
              let imgUrl = url;
              // console.log(imgUrl);
              updateProfile(user, {
                displayName: name,
                photoURL: imgUrl,
              });
              let userData = {
                name: name,
                photoURL: imgUrl,
                email: email,
              };
              createUserProfile(user, userData);

              console.log("Profile created successfully");
              $("#form").trigger("reset");
              // handleUserLoggedInFirstTime(user);
              notifyUser("You will be redirected in 3 seconds");
              contentLoadingController("hide");
              setTimeout(() => {
                window.location.pathname = "/UI/";
              }, 3000);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
      let code = err.code;
      handleUserSignUpError(code);
    });
};

$("#form").on("submit", function (e) {
  e.preventDefault();
  validateSignUpForm();
});

const facebookProvider = new FacebookAuthProvider();

$("#login-with-facebook").click((e) => {
  e.preventDefault();
  signInWithPopup(auth, facebookProvider)
    .then((result) => {
      const user = result.user;
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      handleUserLoggedIn(user);
    })
    .catch((err) => {
      console.log(err);
      console.log(err.message);
    });
});
