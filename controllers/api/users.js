const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

module.exports = {
  create,
  login,
  checkToken
};

/*-- Helper Functions --*/

function createJWT(user) {
  return jwt.sign(
    // data payload
    { user },
    process.env.SECRET,
    { expiresIn: "24h" }
  );
}

async function create(req, res) {
  try {
    const user = await User.create(req.body);
    const token = createJWT(user);
    res.status(200).json(token);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}

async function login(req, res) {
  console.log('logging in')
  console.log(req.body)
  try {
    const user = await User.findOne({email: req.body.email})
    if (!user) throw new Error("No matching user")

    const match = await bcrypt.compare(req.body.password, user.password)

    if (!match) throw Error("wrong password")

    const token = createJWT(user);
    res.status(200).json(token)
  } catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
}

// controllers/api/users.js

function checkToken(req, res) {
  // req.user will always be there for you when a token is sent
  console.log('req.user', req.user);
  res.status(200).json(req.exp);
}
