const express = require("express");
const passport = require("../middleware/passport");
const { forwardAuthenticated } = require("../middleware/checkAuth");
const authController = require("../controller/auth_controller");

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => {
  const errorMessage = req.flash('error');
  res.render("login", { errorMessage: errorMessage });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureFlash: true // Enable flash messages
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
});

router.get('auth/forgot', (req, res) => {
  res.render('forgot');
});
router.post('/forgot', (req, res) => {
  const { email } = req.body;
  
  // TODO: Implement logic to send password reset email
  
  res.render('auth/forgot-success', { email });
});

router.post("/", authController.registerSubmit);

router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.post("/", (req, res) => {
const { email, password } = req.body;
userController.userModel.addUser(email, password, res);
});


module.exports = router;
