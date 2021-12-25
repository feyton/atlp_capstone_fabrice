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

  var setNav = () => {
    var path = window.location.pathname;
    path = decodeURIComponent(path);
    $(".menu-items li a").each((e) => {
      var href = e.target.getAttribute("href");
      console.log(href);
      if (path.substring(0, href.length) === href && href.length > 1) {
        $(this).closest("li").addClass("active");
      } else if (
        window.location.pathname == "/" ||
        window.location.pathname == "index.html"
      ) {
        $("menu-home").addClass("active");
      }
    });
  };
  // setNav();

  // Managing the dropdown on the about me page

  $(".drop-menu-item").on("click", (e) => {
    e.preventDefault();
    $(".about-info").addClass("d-none");
    $(".drop-menu-item").removeClass("active");
    let itemId = e.target.getAttribute("id");
    $(itemId).addClass("active");
    document.getElementById(itemId).classList.add("active");
    let targetID = e.target.getAttribute("data-target");
    $(targetID).removeClass("d-none");
    console.log(targetID);
  });
});
