const mongoose = require("mongoose");
mongoose.set("debug", true);
const Schema = mongoose.Schema;

const PostSchema = new Schema({
	author: String,
	description: String
});

module.exports = mongoose.model("Post", PostSchema, "posts");
