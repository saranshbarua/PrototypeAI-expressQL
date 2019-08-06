const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
	authorId: String,
	description: String
});

module.exports = mongoose.model("Post", PostSchema);
