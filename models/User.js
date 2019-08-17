const mongoose = require("mongoose");
mongoose.set("debug", true);
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: String,
	network: Array
});

module.exports = mongoose.model("User", UserSchema, "users");
