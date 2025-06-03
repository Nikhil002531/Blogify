const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const Blog = require("../models/addBlog");
const { default: mongoose } = require("mongoose");
const Comments = require("../models/comments");

const router = Router();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function(req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`
    cb(null, fileName);
  },
});



const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  res.render("addBlog", {
    user: req.user,
  })
})

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    title,
    body,

    coverImage: `/uploads/${req.file.filename}`,
    createdBy: req.user.id,
  });

  res.redirect(`/blog/${blog._id}`);
})

router.get("/:id", async (req, res) => {
  const blogID = req.params.id;
  const currentBlog = await Blog.findById(blogID).populate("createdBy");
  const allComments = await Comments.find({ blogId: blogID }).populate("createdBy");
  res.render("Blog", {
    currentBlog,
    user: req.user,
    allComments,

  })
})

router.post("/comments/:id", async (req, res) => {

  console.log("id bef log", req.params.id);
  console.log("my id", req.user.id);
  await Comments.create({
    content: req.body.content,
    blogId: req.params.id,
    createdBy: req.user.id,
  })
  console.log("id log", req.params.id);
  return res.redirect(`/blog/${req.params.id}`);
})


module.exports = router;
