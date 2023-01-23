const User = require("../../models/user");
const Doc = require("../../models/doc");
const Section = require("../../models/section");

module.exports = {
  createDoc,
  index
};


async function createDoc(req, res) {
console.log('creating')
 try {
  const {name, content, wordCount} = req.body
  // const wordCount = content.split(' ').length
  // console.log(wordCount)
  console.log(name, content)
  const user = await User.findById(req.user._id)
  console.log(user)
  const newDoc = new Doc({
    user: user._id,
    name,
    content,
    wordCount
  })
  await newDoc.save()
  console.log(newDoc)
  // user.docs.push(new)
 } catch(err) {
  res.status(409).json({ message: err.message})
 }
}

async function index(req, res) {
  try {
    let docs = await Doc.find({user: req.user._id}).sort({createdAt: 'desc'}).exec()
    res.status(200).json(docs)
  } catch(err) {
    res.status(400).json(err)
  }
}