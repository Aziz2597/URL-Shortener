const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");

// Import route handlers
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

// Import middleware functions for authentication
const {  checkForAuthetication,
  restrictTo} = require("./middlewares/auth");


const app = express();
const PORT = 8001;

// Connect to MongoDB using the connection function
connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(() =>
  console.log("MongoDB connected")
);

// Set up view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware for parsing JSON and url-encoded data, and cookie parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthetication);

// Define routes and apply middleware
app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use("/user", userRoute);

// Check authentication for root route and apply static route handling
//For e.g- At very first call at "/", checkAuth executes and returns false as no user has signed in yet. Then it passes to staticRouter and renders "/". As no user detected, it redirects to /login as per function and after login, you get redirected again to "/" as given function in controllers/user.js.
//Now, when redirected to "/", the checkAuth middleware is executed again.
//This time, since the user has successfully logged in, authentication passes, and the control is passed to staticRoute, which again renders "/" which inreturn Render the home page with user's URLs
app.use("/", staticRoute);

// Handle short URL redirection
app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;

  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  // Redirect to the original URL associated with the shortId
  res.redirect(entry.redirectURL);
});

// Start the server
app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));