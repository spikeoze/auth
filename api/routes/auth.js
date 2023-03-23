const express = require("express");
const router = express.Router();
const passport = require("passport");
const isLogged = require("../middleware/isAuthorized");
const {
  registerController,
  loginController,
  logoutController,
} = require("../controller/auth");

router.post("/register", registerController);

router.post("/login", passport.authenticate("local"), loginController);

router.delete("/logout", logoutController);

router.get("/isauthorized", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({id: req.user.id, username: req.user.username});
  } else {
    res.status(401).json({
        message: "unAuthorized",
        status: 401
    });
  }
});

module.exports = router;
