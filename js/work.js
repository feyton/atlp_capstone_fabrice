let modalButtons = document.querySelectorAll("button.modal-view");
modalButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Clicked");
    let dataTarget = e.target.getAttribute("data-target");
    console.log(dataTarget);
    let dataModal = document.getElementById(dataTarget);
    dataModal.style.display = "block";
  });
});
let closeButton = document.querySelector(".close-button");
closeButton.addEventListener("click", () => {
  document.querySelector(".modal").style.display = "none";
});

const displayProjectData = () => {};
