const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sectionSchema = require('./section')

const docSchema = new Schema({
    name: {
        type: String, 
        required: true,
        default: "New Doc"},
    sections: [sectionSchema],
    wordCount: {
      type: Number,
    }
}, {
    timestamps: true,
    // toJSON: {
    //     transform: function(doc, ret) {
    //         delete ret.password;
    //         return ret;
    //     }
    // }
});

module.exports = mongoose.model('Doc', docSchema);
