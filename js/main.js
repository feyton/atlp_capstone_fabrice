$(document).ready(function (e) {
  $header = $("header nav .menu");
  var menuDisplayed = false;

  $(".menu-toggle").click(function (e) {
    if (menuDisplayed) {
      $header.css("display", "none");
      $(".toggle").html(`<i class="fa fa-bars"></i>`);
      menuDisplayed = false;
    } else {
      $header.css("display", "block");
      $(".toggle").html(`<i class="far fa-window-close"></i>`);
      menuDisplayed = true;
    }
  });
  $(window).on("load resize", function () {
    //to toggle class when user click and left it there

    if ($(window).width() > 575) {
      $header.css("display", "block");
      $(".toggle").html(`<i class="fa fa-bars"></i>`);
      menuDisplayed = false;
    } else if ($(window).width() < 575) {
      $header.css("display", "none");
      $(".toggle").html(`<i class="fa fa-bars"></i>`);
      menuDisplayed = false;
    }
  });

  // Disabling links and buttons
  $(".disabled").click(function (e) {
    e.preventDefault();
  });

  // Managing the dropdown on the about me page

  $(".drop-menu-item").on("click", (e) => {
    e.preventDefault();
    let targetID = e.target.getAttribute("data-target");
    let itemId = e.target.getAttribute("id");
    $(".about-info").addClass("d-none");
    $(".drop-menu-item").removeClass("active");
    document.getElementById(itemId).classList.add("active");
    $(targetID).removeClass("d-none");
  });
});
