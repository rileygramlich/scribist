// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// const GoogleUser = require('../models/googleUser');

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_SECRET,
//     callbackURL: process.env.GOOGLE_CALLBACK
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     GoogleUser.findOne({ 'googleId': profile.id }, function(err, gUser) {
//         if (err) return cb(err);
//         if (gUser) {
//           return cb(null, gUser);
//         } else {
//           // we have a new gUser via OAuth!
//           var newGUser = new GoogleUser({
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             googleId: profile.id
//           });
//           newGUser.save(function(err) {
//             if (err) return cb(err);
//             return cb(null, newGUser);
//           });
//         }
//       });
//   }
// ));

// passport.serializeUser(function(gUser, done) {
//     done(null, gUser.id);
// });

// passport.deserializeUser(function(id, done) {
//     GoogleUser.findById(id, function(err, gUser) {
//       done(err, gUser);
//     });
//   });

  
  