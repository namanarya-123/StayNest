// yahan pr humlog authentication ka code likhenge
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema ({
    email:{
        type:String,
        required: true,
    },
});
// by deafult issme ek username aur passwprd ban jata hain..jisse salting hashing baht kuch hota

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);