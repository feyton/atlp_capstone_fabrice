import {
  child,
  onValue,
  push,
  ref as databaseRef,
  set,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytesResumable,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";
import { auth, database, notifyUser, storage } from "./base.js";
const savePost = (
  title,
  image,
  content,
  user,
  summary,
  category,
  published = "true"
) => {
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
          };
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
  content = $("#post-content").val();
  category = $("#category").val();
  savePost(title, image, content, user, summary, category);
  console.log("Form submitted");
  console.log("Created");
});

function loadBlogs() {
  let postRefList = databaseRef(database, "posts");

  onValue(postRefList, (snapshot) => {
    if (snapshot.exists()) {
      $(".t-body").html("");
      let data = Object.keys(snapshot.val()).forEach((key) => {
        let post = snapshot.val()[key];

        let postRow = `
          <tr id="${key}">
            <td class=""><a href="#Update page" class="color-primary post-detail" data-key="${key}">${post.title}</a></td>
            <td><a href="#comments" class="color-primary">${post.category}</a></td>
            <td>${post.published}</td>
            <td class="post-comments"><span>30 &nbsp;<i class="fa fa-check check-mark"
                        aria-hidden="true"></i></span>&nbsp; <span>20 &nbsp;<i
                        class="fa fa-ban unapproved" aria-hidden="true"></i></span></td>

            <td class="actions">
                <span><a href="edit.html" class="edit post-edit" data-key="${key}"><i class="fas fa-edit"></i></a></span>
                <span><a href="edit.html" class="delete post-delete" data-key="${key}"><i class="fas fa-trash"></i></a></span>
            </td>
        </tr>
          
          `;
        $(".t-body").append(postRow);
      });
      handlePostDetailView();
      // console.log(data);
    } else {
    }
  });
}

const handlePostDetailView = () => {
  //   $(".post-detail").on("click", (e) => {
  //     e.preventDefault();
  //     let key = $(this).data("key");
  //     console.log(key);
  //     localStorage.setItem("currentPostKey", JSON.stringify(key));
  //   });
};

loadBlogs();

$(".t-body").on("click", ".post-detail", (e) => {
  e.preventDefault();
  alert("Clicked");
  let key = e.target.getAttribute("data-key");
  console.log(key);
  localStorage.setItem("currentPostKey", JSON.stringify(key));
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
