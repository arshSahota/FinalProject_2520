const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userController = require("../database")

const localLogin = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    try {
      const user = userController.userModel.findOne(email);
      if (!user) {
        return done(new Error("User not found"), false);
      }
      if (user.password===password){
        return done(null, user);
      } else {
        return done(new Error("Incorrect credentials, please try again!"), false);
      }
    } catch (err) {
      return done(err);
    }
  }
);
const localSignup = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
  },
  async (req, email, password, done) => {
    try {
      const existingUser = userController.userModel.findOne(email);
      if (existingUser) {
        return done(
          new Error("A user with this email already exists."),
          false
        );
      }

      const newUser = userController.userModel.addUser(email, password);
      return done(null, newUser);
    } catch (err) {
      return done(err);
    }
  }
);

passport.use("local-signup", localSignup);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = userController.userModel.findById(id);
    if (user) {
      done(null, user);
    } else {
      done(new Error("User not found"), null);
    }
  } catch (err) {
    done(err);
  }
});

passport.use(localLogin);
module.exports = passport;