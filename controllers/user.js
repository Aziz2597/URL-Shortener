const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const { setUser } = require("../service/auth");

// Handle the signup of a new user
async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;

  // Create a new user document in the MongoDB database
  await User.create({
    name,
    email,
    password,
  });

  // Redirect to the root path after successful signup
  return res.redirect("/");
}

// Handle the login of a user
async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  // Find the user document in the database based on the provided email and password
  const user = await User.findOne({ email, password });

  // Check if the user exists
  if (!user) {
    return res.render("login", {
      error: "Invalid Username or Password",
    });
  }

  const token = setUser(user);
  res.cookie("token", token);
  return res.redirect("/");
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
};