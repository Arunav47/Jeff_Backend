//  user id date timestamp note
// for feedback page
const mongoose = require('mongoose');

const moodSchema = new  mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true,
    },
    userid: {
        type: String,
        required: true,
    },
    mood: {
        type: String,
        required: true,
    },
    feeling_better: {
        type: Boolean,
        required: true,
    },
    dateadded: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Mood", moodSchema);