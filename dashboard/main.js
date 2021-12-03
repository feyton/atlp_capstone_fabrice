$(document).ready(function () {
  $sidebar = $(".sidebar");
  $toggle = $(".menu-toggle");
  $main = $("main");
  $icon = $(".sidebar i");
  let icon_left = "fas fa-chevron-circle-left";
  let icon_right = "fas fa-chevron-circle-right";

  $toggle.click(function (e) {
    $main.toggleClass("menu-closed");
    $icon.toggleClass(icon_left);
    $icon.toggleClass(icon_right);
  });
});
