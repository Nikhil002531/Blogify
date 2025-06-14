const { Schema, model, Error } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { generateJWTtoken } = require("../services/auth");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  salt: {
    type: String,
  },

  password: {
    type: String,
    required: true,
  },

  profileImageUrl: {
    type: String,
    default: "/images/user-avatar.png",
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: "USER",
  },

}, { timestamps: true });

userSchema.pre("save", function(next) {
  const user = this;
  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;

  next();
})

userSchema.static("matchPassword", async function(email, password) {
  const user = await this.findOne({ email });
  if (!user)
    throw new Error("User not found")
  const salt = user.salt;
  const userPassword = user.password;
  const userProvidedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (userPassword !== userProvidedPassword)
    throw new Error("Wrong password")

  const token = generateJWTtoken(user);
  return token;
})

const User = model("User", userSchema);
module.exports = User;
