const mongoose = require("mongoose");
mongoose.set("debug", true);
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: String,
	displayName: String,
	userAvatar: String,
	coverPhoto: String,
	designation: String,
	bio: String,
	email: String,
	password: String,
	location: Array,
	interests: Array,
	skills: Array,
	network: Array,
	pendingRequest: Array,
	sentRequest: Array,
	timeline: Array
});

module.exports = mongoose.model("User", UserSchema, "users");
