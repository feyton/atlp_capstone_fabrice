import {
  get,
  ref as databaseRef,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { database } from "./base.js";

function renderDetailPage() {
  let path = window.location.pathname;
  if (path == "/UI/pages/detail.html") {
    console.log("Welcome on blod details");
    let key = localStorage.getItem("currentPostKey");
    key = JSON.parse(key);
    if (key !== null) {
      console.log(key);
      let postRef = databaseRef(database, "posts/" + key);
      get(postRef)
        .then((snapshot) => {
          let post = snapshot.val();
          console.log(post);
          renderDetailTemplate(post);
        })
        .catch((err) => {
          console.log(err);
          setTimeout(() => {
            renderDetailPage();
          }, 2000);
        });
      //   localStorage.removeItem("currentPostKey");
    } else {
      console.log("Not able to log the key");
    }
  }
}

renderDetailPage();

const renderDetailTemplate = (post) => {
  let mon, date, year;
  mon = post.date.split(" ")[0];
  date = post.date.split(" ")[1];
  year = post.date.split(" ")[2];

  let postDetail = `
  <div class="blog-image">
  <img src="${post.imageURL}"
      alt="" class="post-image-render">
  <div class="date-info">
      <h2>${date}</h2>
      <hr>
      <h2>${mon}</h2>
  </div>
</div>
<div class="blog-info">

  <h2 class="post-title-render">${post.title}</h2>
  <div class="post-content-render">
     ${post.content}
  </div>
</div>
<br>

`;

  $(".post-detail-div").html(postDetail);
};
