const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: String,
	network: [String]
});

module.exports = mongoose.model("User", UserSchema);
