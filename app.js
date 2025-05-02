//  // password authentication 
//  //npm i passport, npm i passport-local, npm i passport-local-mongoose

// if(process.env.NODE_ENV != "production"){
//  require('dotenv').config();
// }



//  const express = require("express");

// const app = express();
// const ejsMate = require("ejs-mate");
// const mongoose = require("mongoose");
// const path = require("path");
// const methodOverride = require("method-override");
// const flash = require("connect-flash")
// const passport = require("passport");
// const localStrategy = require("passport-local");
// const User = require("./models/user.js")

// // const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
// const Listing = require("./models/listing.js");
// const Review = require("./models/reviews.js");
// const listingRouter = require("./routes/listing.js");
// const reviewRouter = require("./routes/review.js");
// const userRouter = require("./routes/user.js")
// const session = require("express-session");
// const MongoStore = require('connect-mongo');
// const wrapAsync = require("./utils/wrapAsync.js");
// const { reviewSchema } = require("./schema.js");
// const { connect } = require('http2');

// mongoose.set('debug', true);

// const dburl =process.env.ATLASDB_URL


//   async function main() {
//     try {
//       await mongoose.connect(dburl, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         connectTimeoutMS: 30000,  // 30 seconds for the connection to be established
//         socketTimeoutMS: 45000,   // 45 seconds for socket timeout
//         retryWrites: true,
//       });
//       console.log("Connected to DB successfully");
//     } catch (err) {
//       console.error("Error connecting to DB:", err.message);
//     }
//   }



// async function main() {
//   await mongoose.connect(dburl);
// }




// app.engine('ejs', ejsMate);
// app.set('view engine', 'ejs');
// app.set("views", path.join(__dirname, "views"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.use(express.static(path.join(__dirname, "/public")));




// async function main() {
//     try {
//         await mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true });
//         console.log("Connected to MongoDB Atlas successfully!");
//     } catch (error) {
//         console.error("Error connecting to MongoDB Atlas:", error.message);
//     }
// }
// main();




// const store = MongoStore.create({
//   mongoUrl:dburl,
//   crypto: {
//     secret: process.env.SCRETE,
//   },
//   touchAfter: 24 * 3600,  
// })

// store.on("error", () =>{
//   console.log("ERROR IN MONGO SESSION STORE", err);
// });
// const sessionOptions = {
//   store,
//     secret: process.env.SCRETE,
//     resave: false,
//     saveUninitialized: true,
//     cookie:{
//         expires:Date.now()+7 * 24 * 60 * 60 * 1000,
//         maxAge:7 * 24 * 60 * 60 * 1000,
//         httpOnly:true,
//     }
// };


// console.log("Cloud Name:", process.env.CLOUD_NAME);

// app.get("/", (req, res) => {
//     res.send("hello");
// });
// app.use(session(sessionOptions));
// app.use(flash());
// app.use(passport.initialize());
// app.use(passport.session())
// passport.use(new localStrategy(User.authenticate()))

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.use((req,res, next)=>{
//     res.locals.success= req.flash("success");
//     res.locals.error= req.flash("error");
//     res.locals.currUser = req.user;
//     next();
// })


// app.use("/listing", listingRouter);
//  app.use("/listings/:id/reviews", reviewRouter) 
//  app.use("/", userRouter); 




// app.listen(8080, () => {
//     console.log("Server running on port 8080");
// });

  

// If not in production, load the environment variables
if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require("express");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const wrapAsync = require("./utils/wrapAsync.js");
const { reviewSchema } = require("./schema.js");

const app = express();

// Set mongoose debugging mode
mongoose.set('debug', true);

// MongoDB URL from environment variables
const dburl = process.env.ATLASDB_URL;

async function connectDB() {
  try {
      await mongoose.connect(dburl, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          connectTimeoutMS: 30000,  // 30 seconds for the connection to be established
          socketTimeoutMS: 45000,   // 45 seconds for socket timeout
          retryWrites: true,
      });
      console.log("Connected to DB successfully");
  } catch (err) {
      console.error("Error connecting to DB:", err.message);
  }
}

connectDB();

// MongoDB session store setup
const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
      secret: process.env.SCRETE,
  },
  touchAfter: 24 * 3600,  // 24 hours for session touch
});

store.on("error", (err) => {
  console.log("ERROR IN MONGO SESSION STORE", err);
});

// Session options
const sessionOptions = {
  store,
  secret: process.env.SCRETE,
  resave: false,
  saveUninitialized: true,
  cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  // 7 days
      maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
      httpOnly: true,
  }
};

// Middleware setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Setting locals for flash messages and current user
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Routes
app.use("/listing", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Default route
app.get("/", (req, res) => {
  res.send("hello");
});

// Server setup
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
