const Blog = require("../models/Blog");

const getAllBlogs = async (req, res) => {
  const blogs = await Blog.found();
  if (!blogs) return res.status(204).json({ message: "No posts yet" });
  res.json(blogs);
};

const createBlog = async (req, res) => {
  if (!req?.body?.title || !req?.body?.content || !req?.body?.summary)
    return res.status(400).json({ message: "No provided title" });
  try {
    const result = await Blog.create({
      title: req.body.title,
      title: req.body.summary,
      title: req.body.content,
    });
    console.log(result);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

const updateBlog = async (req, res) => {
  if (!req?.body?.id) return res.status(400).send("Unacceptable result");

  const blog = await Blog.findOne({ _id: req.body.id }).exec();

  if (!blog) {
    return res
      .status(400)
      .json({ message: `Blog ID ${req.body.id} not found` });
  }
  if (req.body.title) blog.title = req.body.title;
  if (req.body.content) blog.content = req.body.content;
  const result = await blog.save();
  res.json(result);
};

const deleteBlog = async (req, res) => {
  if (!req?.body?.id) return res.status(400).send("Unacceptable result");

  const blog = await Blog.findOne({ _id: req.body.id }).exec();

  if (!blog) {
    return res
      .status(400)
      .json({ message: `Blog ID ${req.body.id} not found` });
  }
  const result = await blog.deleteOne({ _id: req.body.id });

  res.json(result);
};

const getBlogPost = async (req, res) => {
  if (!req?.params?.id) return res.status(400).send("Unacceptable result");

  const blog = await Blog.findOne({ _id: req.params.id }).exec();

  if (!blog) {
    return res
      .status(400)
      .json({ message: `Blog ID ${req.params.id} not found` });
  }

  res.json(blog);
};

module.exports = {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogPost,
};
