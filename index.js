const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const router = require("./routes/user");
const mongoose = require("mongoose");
const { checkForAuth } = require("./middlewares/auth");
const BlogRoute = require("./routes/add-blog");
const Blog = require("./models/addBlog")

require("dotenv").config();

const PORT = process.env.PORT;
if (!PORT) {
  console.log("No PORT mentioned in env");
}

mongoose.connect("mongodb://127.0.0.1:27017/blogify")
  .then(() => console.log("database connected"))
  .catch((error) => console.error("nope", error));

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkForAuth("token"));
app.use(express.json());
app.use(express.static(path.resolve("./public/")));

app.set("view engine", "ejs");
app.set('views', path.resolve("./views"));


app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/users", router);
app.use("/blog", BlogRoute);

app.use("/logout", async (req, res) => {
  res.clearCookie("token");
  const allBlogs = await Blog.find({});
  res.render("home", {
    blogs: allBlogs,
  });
});

app.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});

