import {
  get,
  ref as databaseRef,
  update,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { auth, database, notifyUser } from "./base.js";
import { contentLoadingController } from "./index.js";

function renderPostDetailEdit() {
  contentLoadingController();
  let key = localStorage.getItem("activeEditPost");
  key = JSON.parse(key);
  if (key !== null) {
    console.log(key);
    let postRef = databaseRef(database, "posts/" + key);
    get(postRef)
      .then((snapshot) => {
        let post = snapshot.val();
        // console.log(post);
        $("#editable-post").text(post.title);
        $("#title").val(post.title);
        $("#post-summary").val(post.summary);
        //   $("#post-image")[0].files[0];
        tinymce.get("post-content").setContent(post.content);
        //   content = $("#post-content").val();
        //   console.log(content);
        $("#category").val(post.category);
        // console.log(post);
        contentLoadingController("hide");
      })
      .catch((err) => {
        // console.log(err);
        // console.log(err.message);
        if (err.message == "Error: Client is offline.") {
          // console.log("Match");
          setTimeout(() => {
            renderPostDetailEdit();
          }, 1000);
        } else {
          console.log(err);
          contentLoadingController("hide");
          notifyUser("Something got wrong on our end");
        }
      });
  } else {
    contentLoadingController("hide");
    notifyUser("Seems like you just got here", "danger");
    setTimeout(() => {
      window.location.pathname = "/UI/";
    }, 3000);
  }
}

$("#post-edit-form").on("submit", (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  let title, summary, image, content, category, status;
  console.log("Form submitted");
  title = $("#title").val();
  summary = $("#post-summary").val();
  content = tinymce.get("post-content").getContent();
  category = $("#category").val();
  status = $("#status").val();
  updatePost(title, summary, content, category, status);

  console.log("Updated");
});

if (window.location.pathname == "/UI/dashboard/edit.html") {
  renderPostDetailEdit();
}

function returnChanged(oldData, newData) {
  if (oldData === newData) {
    return false;
  } else {
    return true;
  }
}

function updatePost(title, summary, content, category, status) {
  contentLoadingController();
  let key = localStorage.getItem("activeEditPost");
  key = JSON.parse(key);
  let postRef = databaseRef(database, "posts/" + key);
  let published;
  if (status == "published") {
    published = "true";
  } else {
    published = "false";
  }
  get(postRef)
    .then((snapshot) => {
      let user = auth.currentUser;
      let post = snapshot.val();
      let userPostRef = databaseRef(
        database,
        "user-posts/" + user.uid + "/" + key
      );
      if (user && user.uid == post.user) {
        console.log("Editor");
        let newData = {};
        if (returnChanged(post.title, title)) {
          //   newData.push({ title: title });
          newData["title"] = title;
        }
        if (returnChanged(post.content, content)) {
          newData["content"] = content;
        }
        if (returnChanged(post.category, category)) {
          newData["category"] = category;
        }
        if (returnChanged(post.summary, summary)) {
          newData["summary"] = summary;
        }
        if (returnChanged(post.published, published)) {
          newData["published"] = published;
        }
        console.log(newData);

        update(postRef, newData);
        update(userPostRef, newData);
        console.log("Post updated.");
        contentLoadingController("hide");
        notifyUser("New post updated. Redirecting in 3 seconds");
        localStorage.removeItem("activeEditPost");
        setTimeout(() => {
          window.location.pathname = "/UI/dashboard/blog.html";
        }, 3000);
      } else {
        console.log("Not editor");
        contentLoadingController("hide");
        alert("You do not have the permission to edit this post");
      }
    })
    .catch((err) => {
      console.log(err);
      contentLoadingController("hide");
      notifyUser("Something happened on our end.");
    });
}
