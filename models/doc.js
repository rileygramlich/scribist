const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const docSchema = new Schema({
    name: {
        type: String, 
        required: true,
        maxLength: 250,
        default: "New Doc"},
    content: Object,
    wordCount: {
      type: Number,
      default: 0
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Doc', docSchema);
