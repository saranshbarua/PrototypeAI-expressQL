const graphql = require("graphql");
const User = require("../models/User");
const Post = require("../models/Post");

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLID,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull
} = graphql;

const UserType = new GraphQLObjectType({
	name: "User",
	fields: () => ({
		id: { type: new GraphQLNonNull(GraphQLID) },
		username: { type: new GraphQLNonNull(GraphQLString) },
		// displayName: { type: new GraphQLNonNull(GraphQLString) },
		// userAvatar: { type: GraphQLString },
		// email: { type: GraphQLString },
		// password: { type: GraphQLString },
		// interests: { type: new GraphQLList(GraphQLString) },
		// skills: { type: new GraphQLList(GraphQLString) },
		// set: { type: GraphQLString },
		// designation: { type: GraphQLString },
		// bio: { type: GraphQLString },
		network: {
			type: new GraphQLList(UserType),
			resolve(parent, args) {
				let profiles = [];
				parent.network.map(i => {
					for (let j = 0; j < users.length; j++) {
						if (users[j].id == i) {
							profiles.push(users[j]);
						}
					}
				});
				return profiles;
			}
		},
		// pendingNetworkRequests: { type: new GraphQLList(UserType) },
		posts: {
			type: new GraphQLList(PostType),
			resolve(parent, args) {
				let postList = [];
				posts.map(i => {
					if (parent.id === i.author) {
						postList.push(i);
					}
				});
				return postList;
			}
		}
	})
});

const PostType = new GraphQLObjectType({
	name: "Post",
	fields: () => ({
		id: { type: GraphQLID },
		// timestamp: { type: GraphQLString },
		description: { type: GraphQLString },
		author: {
			type: UserType,
			resolve(parent, args) {
				let author;
				users.map(i => {
					if (parent.author === i.id) {
						author = i;
					}
				});
				return author;
			}
		}
		// image: { type: GraphQLString },
		// likes: { type: GraphQLInt },
		// comments: { type: new GraphQLList(GraphQLString) }
	})
});

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
