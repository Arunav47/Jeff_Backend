//  user id date timestamp note
//for quotes 
const mongoose = require('mongoose');

const previousMoodSchema = new  mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    userid: {
        type: String,
        required: true,
    },
    prevMood: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("PreviousMood", previousMoodSchema);