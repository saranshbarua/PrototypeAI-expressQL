const graphql = require("graphql");
const User = require("../../models/User");
const Post = require("../../models/Post");

// ----------- TypeDefs  ------------
const { UserType, PostType } = require("../types/index");

const { GraphQLObjectType, GraphQLID, GraphQLList, GraphQLString } = graphql;

// Root Query
const RootQuery = new GraphQLObjectType({
	name: "RootQuery",
	fields: {
		// Find a user by ID
		user: {
			type: UserType,
			args: { username: { type: GraphQLString } },
			resolve(parent, args) {
				return User.findOne({ username: args.username });
			}
		},
		// Find a post by ID
		post: {
			type: PostType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return Post.findById(args.id);
			}
		},
		// Return all users
		users: {
			type: GraphQLList(UserType),
			resolve(parent, args) {
				return User.find({});
			}
		},
		//  Return all posts
		posts: {
			type: GraphQLList(PostType),
			resolve(parent, args) {
				return Post.find({});
			}
		}
	}
});

module.exports = RootQuery;
