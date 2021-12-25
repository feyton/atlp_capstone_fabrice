import {
  child,
  get,
  onValue,
  push,
  ref as databaseRef,
  remove,
  set,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytesResumable,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";
import { auth, database, notifyUser, storage } from "./base.js";
import { contentLoadingController } from "./index.js";
const savePost = (
  title,
  image,
  content,
  user,
  summary,
  category,
  published = "true"
) => {
  contentLoadingController();
  let imgURL;
  let newPostRef = push(child(databaseRef(database), "posts/")).key;
  let newUserPostRef = push(
    child(databaseRef(database), "user-posts/" + user.uid)
  ).key;

  let postImageRef = storageRef(
    storage,
    "posts/" + newPostRef + "/" + image.name
  );

  let uploadTask = uploadBytesResumable(postImageRef, image);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(progress);
    },
    (err) => {
      console.log(err);
    },
    () => {
      getDownloadURL(postImageRef)
        .then((url) => {
          imgURL = url;
          console.log(imgURL);
          let postData = {
            title: title,
            summary: summary,
            content: content,
            category: category,
            imageURL: imgURL,
            published: published,
            date: new Date().toDateString().split(" ").slice(1).join(" "),
            authorName: user.displayName.split(" ")[0],
            user: user.uid,
            commentCount: 0,
          };
          contentLoadingController("hide");
          set(databaseRef(database, "posts/" + newPostRef), postData);
          set(
            databaseRef(database, "user-posts/" + user.uid + "/" + newPostRef),
            postData
          );

          notifyUser("New Post Created Successfully");
          window.location.pathname = "/UI/dashboard/blog.html";
        })
        .catch((err) => {
          console.log(err);
          contentLoadingController("hide");
        });
    }
  );
};

$("form").submit((e) => {
  e.preventDefault();
});

$("#post-create-form").on("submit", (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  let title, summary, image, content, category;
  title = $("#title").val();
  summary = $("#post-summary").val();
  image = $("#post-image")[0].files[0];
  content = tinymce.get("post-content").getContent();
  //   content = $("#post-content").val();
  //   console.log(content);
  category = $("#category").val();
  savePost(title, image, content, user, summary, category);
  console.log("Form submitted");
  console.log("Created");
});

function loadBlogs(uid) {
  let postRefList = databaseRef(database, "user-posts/" + uid);
  let postHTMLDiv = document.querySelector(".t-body");

  onValue(postRefList, (snapshot) => {
    // contentLoadingController();
    if (snapshot.exists()) {
      postHTMLDiv.innerHTML = "";
      let data = Object.keys(snapshot.val()).forEach((key) => {
        let post = snapshot.val()[key];

        let postRow = `
          <tr id="${key}">
            <td class=""><a href="#Update page" class="color-primary post-detail" data-key="${key}">${post.title}</a></td>
            <td><a href="#comments" class="color-primary">${post.category}</a></td>
            <td>${post.published}</td>
             <td class="actions">
                <span><a href="edit.html" class="edit post-edit" data-key="${key}"><i class="fas fa-edit"></i></a></span>
                <span><a href="edit.html" class="delete post-delete" data-key="${key}"><i class="fas fa-trash"></i></a></span>
            </td>
        </tr>
          
          `;
        postHTMLDiv.innerHTML += postRow;
        // $(".t-body").prepend(postRow);
      });
    } else {
      postHTMLDiv.innerHTML = "No posts yet. use the add sign to create one";
    }
  });
}

function startDashboardPage() {
  let uid = localStorage.getItem("currentUserId");
  if (uid == null) {
    let user = auth.currentUser;
    let uid = user.uid;
    loadBlogs(uid);
  } else {
    loadBlogs(uid);
  }
}
if (window.location.pathname == "/UI/dashboard/blog.html") {
  startDashboardPage();
}

$(".t-body").on("click", ".post-detail", (e) => {
  e.preventDefault();
  //   alert("Clicked");
  let key = e.target.getAttribute("data-key");
  console.log(key);
  localStorage.setItem("currentPostKey", JSON.stringify(key));
  window.location.pathname = "/UI/pages/detail.html";
});
function renderPostDetails() {
  let path = window.location.pathname;
  let key = localStorage.getItem("currentPostKey");
  key = JSON.parse(key);
  if (key !== null) {
    console.log(key);
    localStorage.removeItem("currentPostKey");
  } else {
    console.log("Not able to log the key");
  }
}

$(".t-body").on("click", ".post-edit", (e) => {
  e.preventDefault();
  let postKey = e.target.getAttribute("data-key");
  console.log(postKey);
  localStorage.setItem("activeEditPost", JSON.stringify(postKey));
  window.location.pathname = "/UI/dashboard/edit.html";
});
$(".t-body").on("click", ".post-delete", (e) => {
  e.preventDefault();
  let key = e.target.getAttribute("data-key");
  console.log(key);
  let del = confirm("Are you sure to delete this post?");
  if (del) {
    let user = auth.currentUser;
    let postRef = databaseRef(database, "posts/" + key);

    let userPostRef = databaseRef(
      database,
      "user-posts/" + user.uid + "/" + key
    );
    get(postRef).then((snapshot) => {
      let userId = snapshot.val().user;

      if (user && user.uid == userId) {
        //To -Do: Work On File deletion
        // let imgRef = storageRef(snapshot.val().imageURL);
        // console.log(imgRef);

        // imgRef.delete();
        // console.log("deleted");

        remove(postRef);
        remove(userPostRef);
        notifyUser("Post deleted successfully");
      } else {
        alert("Don't remove a post you don't own");
      }
    });
  } else {
    notifyUser("Your posts are intact.");
  }
});
