const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

const passportConfig = require("./passportConfig");

//-------------------------middleware-------------------------//

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET, POST, DELETE, PUT",
    credentials: true,
  })
);

app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

//* ------------Passport js configuration and middleware-------------------//
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());



//*------------------ Routes -------------------------//
const authRoute = require("./routes/auth");



app.use("/api/auth/", authRoute);




//*------------------------listener-------------------------//

app.listen(process.env.PORT || 8080, () => {
  console.log(`Running on port ${process.env.PORT || 8080}`);
});
