import {
  child,
  get,
  limitToLast,
  onValue,
  orderByChild,
  push,
  query,
  ref as databaseRef,
  set,
  update,
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
          loadRecommendedPost();
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
    limitToLast(10)
  );
  onValue(commentsRef, (snapshot) => {
    if (snapshot.exists()) {
      $(".comment-list-div").html("");
      let data = snapshot.val();
      Object.keys(data).forEach((key) => {
        let comment = data[key];
        let commentElement = renderComment(comment);
        // console.log(comment);

        $(".comment-list-div").prepend(commentElement);
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
    incrementCommentsCount(postId);
    notifyUser("Your comment has been successfully logged");
    console.log("Comment added");
  }
}

const incrementCommentsCount = (key) => {
  let post = databaseRef(database, "posts/" + key);
  let count = 1;
  get(post)
    .then((snapshot) => {
      let data = snapshot.val();
      if (data.commentCount !== null && data.commentCount !== undefined) {
        count = parseInt(post.commentCount) + 1;
      }
      let newData = { commentCount: count };
      // let userPost = databaseRef(
      //   database,
      //   "user-posts/" + data.user + "/" + key
      // );

      update(child(databaseRef(database), "posts/" + key), newData);
      update(
        child(databaseRef(database), "user-posts/" + data.user + "/" + key),
        newData
      );
      console.log("comment recorded");
    })
    .catch((err) => {
      console.log(err);
    });
};

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

const loadRecommendedPost = () => {
  let postRefList = query(
    databaseRef(database, "posts/"),
    orderByChild("date"),
    limitToLast(3)
  );
  let activePost = localStorage.getItem("currentPostKey");
  activePost = JSON.parse(activePost);
  get(postRefList)
    .then((snapshot) => {
      if (snapshot.exists()) {
        $(".recommended-post-div").html("");
        let data = snapshot.val();
        Object.keys(data).forEach((key) => {
          if (key !== activePost) {
            // console.log(key, activePost);

            let post = data[key];
            let postDiv = `
        <div class="r-post">
              <img src="${post.imageURL}"
                   alt="${post.title}-image">
               <a href="#detail.html" class="title read-post" data-key="${key}">${post.title}</a>
               <hr>
           </div>
        
        `;
            $(".recommended-post-div").append(postDiv);
          }
        });
      } else {
        $(".recommended-post-div").html(
          "<h3>No posts recommended for now</h3>"
        );
      }
    })
    .catch((err) => {
      console.log(err);
      $(".recommended-post-div").html("<h3>No posts recommended for now</h3>");
    });
};

$(".recommended-post-div").on("click", ".read-post", (e) => {
  e.preventDefault();
  //   alert("Clicked");
  const key = e.target.getAttribute("data-key");
  // console.log(key);
  localStorage.setItem("currentPostKey", JSON.stringify(key));
  // window.location.pathname = "/UI/pages/detail.html";
  window.location.reload();
});
