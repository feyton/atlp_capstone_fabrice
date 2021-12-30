const express = require("express");
const router = express.Router();
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");
const blogController = require("../controllers/blogController");

router
  .route("/")
  .get(blogController.getAllBlogs)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    blogController.createBlog
  )
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    blogController.updateBlog
  )
  .delete(verifyRoles(ROLES_LIST.Admin), blogController.deleteBlog);

router.route("/:id").get(blogController.getBlogPost);

module.exports = router;
