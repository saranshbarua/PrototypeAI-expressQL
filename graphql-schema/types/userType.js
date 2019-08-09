const graphql = require("graphql");
const Post = require("../../models/Post");

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const UserType = new GraphQLObjectType({
	name: "User",
	fields: () => ({
		id: { type: GraphQLID },
		username: { type: GraphQLString },
		posts: {
			type: new GraphQLList(PostType),
			resolve(parent, args) {
				return Post.find({ author: parent.username });
			}
		}
	})
});

module.exports = UserType;

// This is here to prevent circular dependencies problem which will lead to the formation of infinite loop
const PostType = require("./postType");
