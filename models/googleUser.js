// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const bcrypt = require("bcrypt");

// const SALT_ROUNDS = 6; // 6 is a reasonable value

// const googleUserSchema = new Schema(
//   {
//     name: String,
//     email: String,
//     cohort: String,
//     avatar: String,
//     googleId: String,
//   },
//   {
//     timestamps: true,
//     toJSON: {
//       transform: function (doc, ret) {
//         delete ret.password;
//         return ret;
//       },
//     },
//   }
// );


// module.exports = mongoose.model("GoogleUser", googleUserSchema);
