import {
    child,
    onValue,
    push,
    ref as databaseRef,
    set, orderByChild, query, limitToFirst
  } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";



  function loadBlogs() {
    let postRefList = query(databaseRef(database, "posts"), orderByChild("date"), limitToFirst(3));
  
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