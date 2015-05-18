var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ReminderSchema = new Schema({
    title: { type: String, required: true, index: { unique: true }},
    director: String,
    genre: String,
    longdesc: String,
    shortdesc: String,
    comment: String,
    poster: String
});


module.exports = mongoose.model('Reminder', ReminderSchema);