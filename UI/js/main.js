document.addEventListener("DOMContentLoaded", (event) => {
  // Menu Toggle Declarations
  let header = document.querySelector("header nav .menu");
  let menuDisplayed = false;
  const toggle = document.querySelector(".menu-toggle");
  let toggleHtml = document.querySelector(".toggle");
  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    if (menuDisplayed) {
      header.style.display = "none";
      toggleHtml.innerHTML = `<i class="fa fa-bars"></i>`;
      menuDisplayed = false;
    } else {
      header.style.display = "block";
      toggleHtml.innerHTML = `<i class="far fa-window-close"></i>`;
      menuDisplayed = true;
    }
  });
  // Hiding menu when window is resized
  window.addEventListener("resize", (e) => {
    let width = window.innerWidth;
    if (width < 575) {
      header.style.display = "none";
      toggleHtml.innerHTML = `<i class="fa fa-bars"></i>`;
      menuDisplayed = false;
    } else {
      header.style.display = "block";
      toggleHtml.innerHTML = `<i class="far fa-window-close"></i>`;
      menuDisplayed = true;
    }
  });

  const modalLinks = document.querySelectorAll(".modal-link");
  modalLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = e.target.getAttribute("target");
      const modal = document.getElementById(target);
      modal.style.display = "block";
      document.querySelector("body").style.position = "fixed";
      console.log(target);
    });
  });
  const hideModals = () => {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      modal.style.display = "none";
    });
    document.querySelector("body").style.position = "relative";
  };

  const closeButtons = document.querySelectorAll(".modal-close");
  closeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Clikcked");
      hideModals();
    });
  });

  const displayUploadProgressBar = (percent) => {
    document
      .querySelector(".juice")
      .setAttribute("data-percent", percent + "%");
    document.querySelector(".juice").style.width = percent + "%";
  };
  const displayLoader = (mode = "show", type = "standard") => {
    document.querySelector("body").style.position = "fixed";
    const loader = document.querySelector(".loader-div");
    if (mode == "show") {
      if (type == "standard") {
        let loaderContent = `
            <div class="loader standard">
            </div>
            `;
        loader.innerHTML = loaderContent;
        loader.style.display = "flex";
      } else if (type == "progress") {
        let loaderContent = `
            <div class="loader progress">
                <div class="juice" data-percent=0%></div>
            </div>
            `;
        loader.innerHTML = loaderContent;
        loader.style.display = "flex";
      }
    } else {
      loader.style.display = "none";
      document.querySelector("body").style.position = "relative";
    }
  };

  // About us page
  const dropDowns = document.querySelectorAll(".drop-menu-item");
  const aboutInfo = document.querySelectorAll(".about-info");
  dropDowns.forEach((dropDown) => {
    dropDown.addEventListener("click", (e) => {
      e.preventDefault();
      let target = e.target.getAttribute("data-target");
      let itemId = e.target.getAttribute("id");
      aboutInfo.forEach((about) => {
        about.classList.add("d-none");
      });
      dropDowns.forEach((drop) => {
        drop.classList.remove("active");
      });
      document.getElementById(itemId).classList.add("active");
      document.querySelector(target).classList.remove("d-none");
    });
  });

  // Disabling all buttons
  let disableds = document.querySelectorAll(".disabled");
  disableds.forEach((disabled) => {
    disabled.addEventListener("click", (e) => {
      e.preventDefault();
    });
  });

  // Login Form
  const checkLoginForm = () => {
    try {
      const form = document.querySelector("#login-form");
      form.addEventListener("click", (e) => {
        e.preventDefault();
        const email = form.email.value;
        const password = form.password.value;
        if (!email || !password) {
          console.log("empty");
        } else {
          console.log("Data pass");
        }
      });
    } catch (error) {
      console.warn(error);
    }
  };
  checkLoginForm();
  let percentage = 0;

  const checkLoaders = () => {
    console.log("This is a try on my web loaders.");
    setTimeout(() => {
      displayLoader("show");
    }, 6000);
    setTimeout(() => {
      displayLoader("hide");
    }, 10000);
    setTimeout(() => {
      displayLoader("show", "progress");
      let myInterval = setInterval(() => {
        displayUploadProgressBar(percentage);
        console.log(percentage);
        percentage += 10;
        if (percentage > 100) {
          displayLoader("hide");
          clearInterval(myInterval);
        }
      }, 1000);
    }, 12000);
    setTimeout(() => {
      let notShow = confirm("Don't see these loaders again?");
      if (notShow) {
        localStorage.setItem("loaded", true);
      }
    }, 22000);
  };
  if (
    window.location.pathname == "/" ||
    window.location.pathname == "/index.html"
  ) {
    const loaded = localStorage.getItem("loaded");
    if (loaded) {
    } else {
      checkLoaders();
    }
  }
});
