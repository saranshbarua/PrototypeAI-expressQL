const graphql = require("graphql");
const User = require("../../models/User");

const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;

const PostType = new GraphQLObjectType({
	name: "Post",
	fields: () => ({
		id: { type: GraphQLID },
		description: { type: GraphQLString },
		author: {
			type: UserType,
			resolve(parent, args) {
				return User.findOne({ username: parent.author });
			}
		}
	})
});

module.exports = PostType;

// This is here to prevent circular dependencies problem which will lead to the formation of infinite loop
const UserType = require("./userType");
