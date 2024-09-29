//  user id date timestamp note
// for journal
const mongoose = require('mongoose');

const userDetailsSchema = new  mongoose.Schema({
    userId: {//email
        type: String,
        unique: true,
        required: true
    },
    userName: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("UserDetails", userDetailsSchema);