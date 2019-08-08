const graphql = require("graphql");
const User = require("../models/User");
const Post = require("../models/Post");

// ----------- TypeDefs  ------------
const { UserType, PostType } = require("./types/index");

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull
} = graphql;

// Root Query
const RootQuery = new GraphQLObjectType({
	name: "RootQuery",
	fields: {
		// Find a user by ID
		user: {
			type: UserType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				let user;
				users.map(i => {
					if (i.id === args.id) {
						user = i;
					}
				});
				return user;
			}
		},
		// Find a post by ID
		post: {
			type: PostType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				let post;
				posts.map(i => {
					if (args.id === i.id) {
						post = i;
					}
				});
				return post;
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

// Mutations
const Mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		addUser: {
			type: UserType,
			args: {
				username: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve(parent, args) {
				let user = new User({
					username: args.username
				});

				return user.save();
			}
		},
		addPost: {
			type: PostType,
			args: {
				description: { type: GraphQLString }
			},
			resolve(parent, args) {
				let post = new Post({
					description: args.description
				});

				return post.save();
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});
