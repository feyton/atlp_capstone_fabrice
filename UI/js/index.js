import {
  limitToFirst,
  onValue,
  orderByChild,
  query,
  ref as databaseRef,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { auth, database } from "./base.js";
import { checkEmail } from "./signup.js";

function loadBlogsIndex() {
  contentLoadingController();
  let postRefList = query(
    databaseRef(database, "posts"),
    orderByChild("date"),
    limitToFirst(3)
  );

  onValue(postRefList, (snapshot) => {
    if (snapshot.exists()) {
      $(".index-blog-list-div").html("");
      let data = Object.keys(snapshot.val()).forEach((key) => {
        // console.log(key);
        let post = snapshot.val()[key];
        let mon, date, year;
        mon = post.date.split(" ")[0];
        date = post.date.split(" ")[1];
        year = post.date.split(" ")[2];

        let postRow = `
          <div class="blog-card">
          <div class="blog-image">
              <img src="${post.imageURL}"
                  alt="">
              <div class="date-info">
                  <h2>${date}-${mon}</h2>
                  <hr>
                  <h2>${year}</h2>
              </div>
          </div>
          <div class="blog-info">

              <a href="#here" class="title capitalize read-post" data-key="${key}">

                  <h2 class="link">${post.title}</h2>
              </a>
              <p>${post.summary}</p><br>

              <a href="#post" class="btn btn-more read-post" data-key="${key}">Read more&nbsp;<i class="fa fa-fighter-jet"
                      aria-hidden="true" data-key="${key}"></i></a><br>

          </div>
          <br>

      </div>
      <hr>
            
            `;
        $(".index-blog-list-div").append(postRow);
      });
      contentLoadingController("hide");
    } else {
      contentLoadingController("hide");
      console.log("No post yet");
    }
  });
}

let path = window.location.pathname;
if (path == "/UI/index.html" || path == "/UI/") {
  loadBlogsIndex();
}

if (path == "/UI/pages/blog.html") {
  loadBlogsBloPage();
}
$(".index-blog-list-div").on("click", ".read-post", (e) => {
  e.preventDefault();
  //   alert("Clicked");
  const key = e.target.getAttribute("data-key");
  // console.log(key);
  localStorage.setItem("currentPostKey", JSON.stringify(key));
  window.location.pathname = "/UI/pages/detail.html";
});

export function contentLoadingController(state = "show") {
  if (state == "show") {
    $(".full-loader").removeClass("d-none");
    $("body").addClass("noscroll");
  } else if (state == "hide") {
    $(".full-loader").addClass("d-none");
    $("body").removeClass("noscroll");
  }
}

export function loadBlogsBloPage() {
  contentLoadingController();
  let postRefList = query(
    databaseRef(database, "posts"),
    orderByChild("date"),
    limitToFirst(3)
  );

  onValue(postRefList, (snapshot) => {
    if (snapshot.exists()) {
      $(".index-blog-list-div").html("");
      let data = Object.keys(snapshot.val()).forEach((key) => {
        // console.log(key);
        let post = snapshot.val()[key];
        let mon, date, year;
        mon = post.date.split(" ")[0];
        date = post.date.split(" ")[1];
        year = post.date.split(" ")[2];

        let postRow = `
        <!-- Blog -->
        <div class="blog-card">
            <div class="blog-image">
                <img src="${post.imageURL}"
                    alt="">
                <div class="date-info">
                    <h2>${date}</h2>
                    <hr>
                    <h2>${mon}</h2>
                </div>
            </div>
            <div class="blog-info">
                <a href="#./detail.html" class="title">
                    <h2 class="read-post" data-key="${key}">${post.title}</h2>
                </a>
                <p>${post.summary}</p><br>
                <a href="#detail.html" class="btn btn-read read-post" data-key="${key}">Read more&nbsp;<i class="fa fa-fighter-jet"
                        aria-hidden="true"></i></a><br>

            </div>
            <br>

        </div>
        <hr>



        <!-- End blog -->
            
            `;
        $(".index-blog-list-div").append(postRow);
      });
      contentLoadingController("hide");
    } else {
      contentLoadingController("hide");
      console.log("No post yet");
    }
  });
}

const checkContactForm = () => {
  let form = document.getElementById("contact-form");
  let user = auth.currentUser;
  if (user !== null) {
    let userRef = databaseRef(database, "users/" + user.uid);
    get(userRef).then((snapshot) => {
      let data = snapshot.val();
      setInputValue("contact-email", data.email);
      setInputValue("contact-name", data.name);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let data = form.serializeArray();
    console.log(data);
  });
};

const setInputValue = (id, value) => {
  document.getElementById(id).value = value;
};

if (
  window.location.pathname == "/UI/" ||
  window.location.pathname == "/UI/index.html"
) {
  checkContactForm();
}

const validateContactForm = (name, email, message) => {
  if (name.length >= 3 && checkEmail(email) && validateMessage(message)) {
    console.log("Form valid");
  } else {
    document
      .getElementsByClassName("contact-form-error")
      .text("Please fill the form correctly");
  }
};
const validateMessage = () => {};
