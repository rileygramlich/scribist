// Middleware functions
const ensureLoggedIn = require("../../config/ensureLoggedIn");

// routes/api/users.js

const express = require("express");
const router = express.Router();
const usersCtrl = require("../../controllers/api/users");

// // Google OAuth:
// const passport = require("passport");
// router.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// router.get(
//   "/oauth2callback",
//   passport.authenticate("google", {
//     successRedirect: "/",
//     failureRedirect: "/",
//   })
// );

// // OAuth logout route
// router.get('/logout', function(req, res){
//     req.logout();
//     res.redirect('/');
//   });
  

// POST /api/users
router.post("/login", usersCtrl.login);
router.post("/", usersCtrl.create);

// GET /api/users/check-token
router.get("/check-token", ensureLoggedIn, usersCtrl.checkToken);

module.exports = router;
