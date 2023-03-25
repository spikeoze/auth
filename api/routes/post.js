const express = require("express");
const router = express.Router();
const { isAuthorized } = require("../middleware/isAuthorized");
const {
  createPost,
  deletePost,
  getPosts,
  updatePost,
} = require("../controller/post");
// Define the '/post' route and wrap it with the isAuthorized middleware
router.get("/", getPosts);
router.post("/", isAuthorized, createPost);
router.put("/:id", isAuthorized, updatePost);
router.delete("/:id", isAuthorized, deletePost);

module.exports = router;
