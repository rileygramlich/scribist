const User = require("../../models/user");
const Doc = require("../../models/doc");
const Section = require("../../models/section");

module.exports = {
  createDoc,
  updateDoc,
  deleteDoc,
  index,
  getDoc,
};

async function createDoc(req, res) {
  console.log("creating");
  try {
    const user = await User.findById(req.user._id);
    console.log(user);
    const newDoc = new Doc({
      user: user._id,
    });
    await newDoc.save();
    const docId = newDoc._id;
    console.log(docId);
    console.log(newDoc);
    res.json(docId);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
}

async function deleteDoc(req, res) {
  try {
    const { docId } = req.body;
    console.log(docId);
    Doc.findOneAndDelete({ _id: docId }).then(function () {
      console.log("deleted");
    });
    const docs = await Doc.find({ user: req.user._id });
    res.json(docs);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
}

async function index(req, res) {
  try {
    let docs = await Doc.find({ user: req.user._id })
      .sort({ createdAt: "desc" })
      .exec();
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
}

async function getDoc(req, res) {
  console.log("getting doc");
  console.log(req.params.docId);
  const currDoc = await Doc.findById(req.params.docId);
  res.status(200).json(currDoc);
}

async function updateDoc(req, res) {
  // first get the doc and then update the name and content
  try {
    console.log("updating");
    console.log(req.body);
    console.log(req.body.content);
    const doc = await Doc.findByIdAndUpdate(req.params.docId, {
      name: req.body.name,
    });
    console.log(doc);
    res.json(doc);
  } catch (err) {
    console.log(err);
  }
}
