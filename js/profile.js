document.addEventListener("DOMContentLoaded", (e) => {
  const updateBtn = document.querySelector(".btn-update-profile");
  const updateDiv = document.querySelector(".update-div");
  updateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    updateDiv.classList.toggle("d-none");
  });

  document.querySelector("#hideModal").addEventListener("click", (e) => {
    console.log("clicked");
    e.preventDefault();
    document.querySelector(".modal").style.display = "none";
  });
  document.querySelector(".update-picture").addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector(".modal").style.display = "flex";
  });

  const image = document.getElementById("user-image");
  try {
    image.addEventListener("change", (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        document.querySelector(".image-div").innerHTML = `
        <img src="${e.target.result}" alt="uploaded image">`;
      };
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.warn(error);
  }
});
