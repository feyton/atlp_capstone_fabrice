import {
  limitToFirst,
  onValue,
  orderByChild,
  query,
  ref as databaseRef,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { database } from "./base.js";

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

                  ${post.title}
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

function loadBlogsBloPage() {
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
