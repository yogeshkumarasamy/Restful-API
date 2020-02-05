const mongoose = require( 'mongoose' );
const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, required: true, match: emailRegex }, //unique does not validate anything but do let the mongo know it should be unique and hence results in performance 
    password: { type: String, required: true }
});
module.exports = mongoose.model('User', userSchema);