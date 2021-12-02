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
  $(".disabled").click(function(e) {
    e.preventDefault()
  })
});
