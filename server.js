const express = require("express");
const app = express();
// importing express module and using express to build the API for the app.
const mongoose = require("mongoose");
// importing mongoose as a library for quality of life improvements while querying MongoDB.
const passport = require("passport");
// adds authentication to our applications
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
// sets up cookie session for user
// allows user to skip login if they have an active seesion with their cookie on the server
const methodOverride = require("method-override");
// allows usage of PUT and DELETE requests on a form through querty parameters.
const flash = require("express-flash");
// displays message on server response
const logger = require("morgan");
// displays extra details about what requests and responses the server gives and receives.
const connectDB = require("./config/database");
// connects to MongoDB
const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");
// set up router routes.

//Use .env file in config folder
// MUST BE REMOVED WHEN HOSTING since most have their own .env file method.
require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

//Connect To Database
connectDB();

//Using EJS for views
app.set("view engine", "ejs");

//Static Folder
app.use(express.static("public"));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);

//Server Running
app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
});
