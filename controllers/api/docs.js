const mongoose = require("mongoose");
const Doc = require("../../models/doc");

module.exports = { index, create, show, rename, remove };

async function findDoc(req, res) {
    const { docId } = req.params;
    if (!mongoose.isValidObjectId(docId)) {
        res.status(404).json({ error: "That doc doesn't exist." });
        return null;
    }
    const doc = await Doc.findById(docId).populate("user", "name");
    if (!doc) res.status(404).json({ error: "That doc doesn't exist." });
    return doc;
}

// GET /api/docs -> { owned, shared }, most recently edited first
async function index(req, res) {
    const docs = await Doc.find({ $or: [{ user: req.user._id }, { collaborators: req.user._id }] })
        .select("-content")
        .populate("user", "name")
        .sort({ updatedAt: -1 });
    const all = docs.map((d) => d.forUser(req.user._id));
    res.json({ owned: all.filter((d) => d.owner), shared: all.filter((d) => !d.owner) });
}

// POST /api/docs  { name?, content? }  (Berserk saves its text this way)
async function create(req, res) {
    const { name, content, wordCount } = req.body || {};
    const doc = await Doc.create({
        user: req.user._id,
        name: typeof name === "string" && name.trim() ? name.trim().slice(0, 250) : undefined,
        content: content && Array.isArray(content.ops) ? content : undefined,
        wordCount: Number.isFinite(wordCount) ? wordCount : 0,
    });
    await doc.populate("user", "name");
    res.status(201).json(doc.forUser(req.user._id));
}

// GET /api/docs/:docId?share=token. A valid share token adds you as a collaborator.
async function show(req, res) {
    const doc = await findDoc(req, res);
    if (!doc) return;
    if (!doc.canEdit(req.user._id)) {
        if (!req.query.share || req.query.share !== doc.shareToken) {
            return res.status(403).json({ error: "This doc hasn't been shared with you. Ask its owner for the share link." });
        }
        // Joining isn't an edit, so it shouldn't bump the doc's "last edited" time.
        await Doc.updateOne({ _id: doc._id }, { $addToSet: { collaborators: req.user._id } }, { timestamps: false });
        doc.collaborators.addToSet(req.user._id);
    }
    res.json(doc.forUser(req.user._id));
}

// PATCH /api/docs/:docId  { name }
async function rename(req, res) {
    const doc = await findDoc(req, res);
    if (!doc) return;
    if (!doc.canEdit(req.user._id)) return res.status(403).json({ error: "You can't edit this doc." });
    const name = String((req.body && req.body.name) || "").trim().slice(0, 250);
    doc.name = name || "Untitled";
    await doc.save();
    req.app.get("io").to(String(doc._id)).emit("name-changed", doc.name);
    res.json(doc.forUser(req.user._id));
}

// DELETE /api/docs/:docId: the owner deletes it; a collaborator just leaves it.
async function remove(req, res) {
    const doc = await findDoc(req, res);
    if (!doc) return;
    if (doc.isOwner(req.user._id)) {
        await doc.deleteOne();
        req.app.get("io").to(String(doc._id)).emit("doc-deleted");
        return res.json({ deleted: true });
    }
    if (!doc.canEdit(req.user._id)) return res.status(403).json({ error: "You can't change this doc." });
    doc.collaborators.pull(req.user._id);
    await doc.save();
    res.json({ left: true });
}
