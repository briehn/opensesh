const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const debug = require("debug");

//MODELS
require("./models/User");
require("./models/Post");
require("./models/Like");
require("./models/Friend");
require("./config/passport");

const passport = require("passport");

//CORS
const cors = require("cors");
const { isProduction } = require("./config/keys");

//CSRF
const csurf = require("csurf");

//ROUTERS
const usersRouter = require("./routes/api/users");
const postsRouter = require("./routes/api/posts");
const likesRouter = require("./routes/api/likes");
const friendsRouter = require("./routes/api/friends");
const csrfRouter = require("./routes/api/csrf");

const app = express();

app.use(logger("dev")); // log request components (URL/method) to terminal
app.use(express.json()); // parse JSON request body
app.use(express.urlencoded({ extended: false })); // parse urlencoded request body
app.use(cookieParser()); // parse cookies as an object on req.cookies

app.use(passport.initialize());

if (!isProduction) {
  app.use(cors());
}

app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true,
    },
  })
);

app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.use("/api/likes", likesRouter);
app.use("/api/friends", friendsRouter);
app.use("/api/csrf", csrfRouter);

// Express Error Logger
const serverErrorLogger = debug("backend:error");

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.statusCode = 404;
  next(err);
});

app.use((err, req, res, next) => {
  serverErrorLogger(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    statusCode,
    errors: err.errors,
  });
});

module.exports = app;
