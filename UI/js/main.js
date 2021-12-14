$(document).ready(function (e) {
  $header = $(".menu-items");

  $(".menu-toggle").click(function (e) {
    $header.toggleClass("menu-displayed");
  });
  $(window).on("load resize", function () {
    //to toggle class when user click and left it there
    $(".menu-items").removeClass("menu-displayed", $(window).width() > 575);
  });

  // Disabling links and buttons
  $(".disabled").click(function (e) {
    e.preventDefault();
  });

  var setNav = () => {
    var path = window.location.pathname;
    path = decodeURIComponent(path);
    $(".menu-items li a").each(() => {
      var href = $(this).attr("href");
      console.log(href);
      if (path.substring(0, href.length) === href && href.length > 1) {
        $(this).closest("li").addClass("active");
      } else if (window.location.pathname == "/") {
        $("menu-home").addClass("active");
      }
    });
  };
  // setNav();
});
