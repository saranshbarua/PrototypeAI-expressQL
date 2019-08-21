const mongoose = require("mongoose");
mongoose.set("debug", true);
const Schema = mongoose.Schema;

const PostSchema = new Schema({
	author: String,
	description: String,
	timestamp: String,
	description: String,
	image: String,
	likedBy: Array,
	comments: Array
});

module.exports = mongoose.model("Post", PostSchema, "posts");
