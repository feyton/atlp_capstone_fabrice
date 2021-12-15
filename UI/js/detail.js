import {
  child,
  get,
  limitToFirst,
  onValue,
  orderByChild,
  push,
  query,
  ref as databaseRef,
  set,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { auth, database, notifyUser } from "./base.js";
import { contentLoadingController } from "./index.js";

function renderDetailPage() {
  contentLoadingController();
  let path = window.location.pathname;
  if (path == "/UI/pages/detail.html") {
    // console.log("Welcome on blod details");
    let key = localStorage.getItem("currentPostKey");
    key = JSON.parse(key);
    if (key !== null) {
      // console.log(key);
      let postRef = databaseRef(database, "posts/" + key);
      get(postRef)
        .then((snapshot) => {
          let post = snapshot.val();
          // console.log(post);
          renderDetailTemplate(post);
          contentLoadingController("hide");
          renderAuthorSection(post.user);
          loadComments(key);
        })
        .catch((err) => {
          // console.log(err);
          // console.log(err.message);
          if (err.message == "Error: Client is offline.") {
            // console.log("Match");
            setTimeout(() => {
              renderDetailPage();
            }, 2000);
          } else {
            // console.log(err);
          }
        });

      // Handle Comments

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

const renderAuthorSection = (uid) => {
  let userRef = databaseRef(database, "users/" + uid);
  get(userRef)
    .then((snapshot) => {
      let data = snapshot.val();
      let template = `
    
      <div class="author-avatar"><img src="${data.photoURL}" alt=""></div>
      <h2>${data.name}</h2>
       <p>A happy traveller, and a software developer by passion. If you see me around,
          say hi and we can talk dev on a cup of coffe</p>
       <button class="coffee">
          <span>Follow</span><span><i class="fab fa-facebook"></i><i class="fab fa-github"></i></span>
       </button>
    
      `;

      $(".author-card").html("");
      $(".author-card").html(template);
    })
    .catch((err) => {
      console.log(err);
      $(".author-card").html("Unable to retrieve the author");
    });
};

const loadComments = (postId) => {
  let commentsRef = query(
    databaseRef(database, "comments/" + postId + "/"),
    orderByChild("date"),
    limitToFirst(10)
  );
  onValue(commentsRef, (snapshot) => {
    if (snapshot.exists()) {
      $(".comment-list-div").html("");
      let data = snapshot.val();
      Object.keys(data).forEach((key) => {
        let comment = data[key];
        let commentElement = renderComment(comment);
        // console.log(comment);

        $(".comment-list-div").append(commentElement);
      });
    } else {
      let commentElement = `
      <h3 class="no-comment">Be the first to comment</h3>
      
      `;
      $(".comment-list-div").html(commentElement);
    }
  });
  let template = `


  `;
};

function addComment(postId) {
  let user = auth.currentUser;
  let message = $("#user-comment").val();

  if (user !== null) {
    let newPostRef = push(
      child(databaseRef(database), "comments/" + postId + "/")
    ).key;
    let newUserPostRef = push(
      child(
        databaseRef(database),
        "user-comments/" + user.uid + "/" + postId + "/"
      )
    ).key;

    let commentData = {
      user: user.uid,
      message: message,
      date: new Date().toDateString().split(" ").slice(1).join(" "),
      author: user.displayName,
    };
    // console.log("Data created");
    set(
      databaseRef(database, "comments/" + postId + "/" + newPostRef),
      commentData
    );
    set(
      databaseRef(
        database,
        "user-comments/" + user.uid + "/" + postId + "/" + newPostRef
      ),
      commentData
    );
    notifyUser("Your comment has been successfully logged");
    console.log("Comment added");
  }
}

function renderComment(comment) {
  let commentElement = `
  <li>
  <h3 class="title">By ${comment.author}</h3>
   <p class="comment-content">${comment.message}</p><br>
   <strong>On ${comment.date}</strong>
  <hr>
</li>
  
  `;
  return commentElement;
}

// loadComments()
// renderAuthorSection()
$("#comment-form").submit((e) => {
  e.preventDefault();

  let key = localStorage.getItem("currentPostKey");
  key = JSON.parse(key);
  addComment(key);
  $("#comment-form").trigger("reset");
});
