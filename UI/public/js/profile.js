$(document).ready(() => {
  $(".btn-update-profile").click((e) => {
    e.preventDefault();
    $(".update-div").toggle(200);
  });

  $(".modal #hideModal").click((e) => {
    e.preventDefault();
    $(".modal").toggle(200);
  });
  $(".update-picture").click((e) => {
    e.preventDefault();
    $(".modal").toggle(200);
  });

  let image = $("#user-image");
  image.on("change", () => {
    let file = image[0].files[0];
    let reader = new FileReader();
    reader.onload = (e) => {
      $(".image-div").html(`<img src="${e.target.result}" alt="">`);
    };
    reader.readAsDataURL(file);
  });
});
