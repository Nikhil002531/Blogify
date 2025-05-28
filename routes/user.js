const { Router } = require("express");
const userSchema = require("../models/user")
const router = Router();

router.get("/signin", (req, res) => {
  res.render("signin");
});
router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    console.log("user details", username, email, password);
    await userSchema.create({ username, email, password });

    return res.redirect("/");
  } catch (error) {
    console.error(error);
  }
});


router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await userSchema.matchPassword(email, password);

    if (!token) {
      return res.status(401).render("signin", { error: "Invalid credentials" });
    }
    res.cookie("token", token);
    return res.redirect("/");
  } catch (error) {
    console.error("Signin error:", error);
    return res.render("signin", { error: "Incorrect email or password" });
  }
});

module.exports = router;
