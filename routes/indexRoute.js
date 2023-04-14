const express = require("express");
const router = express.Router();
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");
const passport = require("../config/passport");

router.get("/", (req, res) => {
  res.send("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});
router.get("/", (req, res) => {
  // Some logic to get reminders
  res.render("index", { reminders: reminders, user: req.user });
});
// Add this code block for handling the login route
router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
}));

router.get("/forgot", (req, res) => {
  res.render("auth/forgot");
});
router.get('/socialshare', reminderController.socialshare);

module.exports = router;
