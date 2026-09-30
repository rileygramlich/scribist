const crypto = require("crypto");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const docSchema = new Schema(
    {
        name: { type: String, required: true, trim: true, maxlength: 250, default: "Untitled" },
        // A Quill delta: { ops: [...] }
        content: { type: Object, default: () => ({ ops: [] }) },
        wordCount: { type: Number, default: 0 },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        // People who opened the share link. They can edit, but only the owner can delete.
        collaborators: [{ type: Schema.Types.ObjectId, ref: "User", index: true }],
        // The secret part of the share link, so a doc can't be opened by guessing its id.
        shareToken: { type: String, default: () => crypto.randomBytes(12).toString("base64url") },
    },
    { timestamps: true }
);

// Works whether or not `user` / `collaborators` are populated.
const idOf = (ref) => String((ref && ref._id) || ref);

docSchema.methods.isOwner = function (userId) {
    return idOf(this.user) === String(userId);
};

docSchema.methods.canEdit = function (userId) {
    return this.isOwner(userId) || this.collaborators.some((ref) => idOf(ref) === String(userId));
};

// What the client sees. The share token only goes to the owner.
docSchema.methods.forUser = function (userId, { withContent = false } = {}) {
    const owner = this.isOwner(userId);
    return {
        _id: this._id,
        name: this.name,
        wordCount: this.wordCount,
        updatedAt: this.updatedAt,
        createdAt: this.createdAt,
        owner,
        ownerName: this.user && this.user.name,
        shareToken: owner ? this.shareToken : undefined,
        content: withContent ? this.content : undefined,
    };
};

module.exports = mongoose.model("Doc", docSchema);
