$(document).ready(function () {
  $(".input").each(function () {
    $(this).on("focus", function () {
      //   alert("focused");
      $(this).parent().next(".message-div").toggle(100, "linear");
    });
    $(this).on("blur", function () {
      $(this).parent().next(".message-div").toggle(100, "linear");
    });
  });

  //   Form validation
  function validatePassword() {
    var lowerCaseLetter = /[a-z]/g;
    var upperCaseLetter = /[A-Z]/g;
    var numbers = /[0-9]/g;
    var valid = false;
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
      if ($(this).val().length >= 6) {
      }
      if (
        $(this).val().match(lowerCaseLetter) &&
        $(this).val().match(upperCaseLetter) &&
        $(this).val().match(numbers) &&
        $(this).val().length >= 6
      ) {
        valid = true;
        $("#password-icon").removeClass("invalid");
      }
      console.log(valid);
      return valid;
    });
  }
  var passVal = validatePassword();
  function validatePasswordConfirm() {
    $confInput = $("#user-password-confirm");
    $pass = $("#user-password").val();

    $confInput.on("keyup", function () {
      if ($pass == 0) {
        console.log($confInput.val());
        $confInput.parent().next(".message-div").innerHTML +=
          "<h3>Fill Password first</h3>";
      }
    });
  }
  validatePasswordConfirm();
});
