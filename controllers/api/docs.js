const User = require("../../models/user");
const Doc = require("../../models/doc");
const Section = require("../../models/section");

module.exports = {
  createDoc,
};


async function createDoc(req, res) {
console.log('creating')
 try {
  const {name, content} = req.body
  // const wordCount = content.split(' ').length
  // console.log(wordCount)
  console.log(name, content)
  const user = await User.findById(req.user._id)
  console.log(user)
  const newDoc = new Doc({
    name,
    content
  })
  await newDoc.save()
  console.log(newDoc)
  user.docs.push(newDoc._id)
  user.save()
  console.log(user)
  // user.docs.push(new)
 } catch(err) {
  res.status(409).json({ message: err.message})
 }
}