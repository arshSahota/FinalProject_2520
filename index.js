const express = require("express");
const app = express();
const session = require("express-session");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const reminderController = require("./controller/reminder_controller");
const authController = require("./controller/auth_controller");
const passport = require("./middleware/passport");
const userModel = require("./database").userModel;

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressLayouts);

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use((req, res, next) => {
  console.log(`User details are: `);
  console.log(req.user);

  console.log("Entire session object:");
  console.log(req.session);

  console.log(`Session details are: `);
  console.log(req.session.passport);
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");
const authRoute = require("./routes/authRoute");
const remindersController = require("./controller/reminder_controller");
app.use("/auth", authRoute);

// Routes start here

app.get("/reminders", reminderController.list);

app.get("/reminder/new", reminderController.new);

app.get("/reminder/:id", reminderController.listOne);

app.get("/reminder/:id/edit", reminderController.edit);

app.post("/reminder", reminderController.create);

app.post("/reminder/update/:id", reminderController.update);

app.post("/reminder/delete/:id", reminderController.delete);

app.get("/reminder/:id/subtask/new", reminderController.newSubtask);

app.post("/reminder/:id/subtask/create", reminderController.createSubtask);

app.get("/login", authController.login);

app.post("/login", authController.loginSubmit);
app.post("/logout", authController.logout);

app.get("/socialshare", reminderController.getSocialShare);
app.post("/follow", remindersController.followSocialShare);

app.post("/", authController.registerSubmit);
app.listen(3001, () => {
  console.log(
    "Server running. Visit: localhost:3001/reminders in your browser 🚀"
  );
});
