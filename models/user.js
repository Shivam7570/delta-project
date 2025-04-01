const { types } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email:{
    type:String,
    require:true,
    unique:true,
    }
});
UserSchema.plugin(passportLocalMongoose);
// UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);