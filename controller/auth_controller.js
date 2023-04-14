const passport = require("../middleware/passport");
const userController = require("../database")

let authController = {
login: (req, res) => {
    res.render("login");
  },
register: (req, res) => {
    res.render("register");
},


loginSubmit: (req, res, next) => {
    passport.authenticate("local", (err, user) => {
        if (err) {
            return res.render("login", { errorMessage: err.message });
        }
        if (!user) {
            return res.redirect("/login");
        }
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect("/reminders");
        });
    })(req, res, next);
},

registerSubmit: (req, res, next) => {
  passport.authenticate("local-signup", (err, user) => {
    if (err) {
      return res.render("register", { errorMessage: err.message });
    }
    if (!user) {
      return res.redirect("/register");
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/auth/login");
    });
  })(req, res, next);
},

logout: (req, res, next) => {  
    req.logout((err) => {
      if (err) { return next(err); }
      req.session.destroy(() => {
        res.redirect('/login');
      });
    });
  },
}
  
module.exports = authController;
