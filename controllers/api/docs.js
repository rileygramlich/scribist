const User = require("../../models/user");
const Doc = require("../../models/doc");
const Section = require("../../models/section");

module.exports = {
  create,
};


function create(req, res) {
    console.log("creating doc")
    console.log(req.body)
    console.log(req.user)
    res.status(200)
}