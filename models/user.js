const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, maxlength: 80 },
        email: { type: String, unique: true, trim: true, lowercase: true, required: true, maxlength: 254 },
        // Not required for people who only ever sign in with Google.
        password: { type: String, minlength: 6, required() { return !this.googleId; } },
        googleId: { type: String, unique: true, sparse: true },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.password;
                return ret;
            },
        },
    }
);

userSchema.pre("save", async function () {
    if (!this.password || !this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

userSchema.methods.checkPassword = function (password) {
    return Boolean(this.password) && bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
