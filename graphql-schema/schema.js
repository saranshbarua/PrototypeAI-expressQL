const graphql = require("graphql");
const User = require("../models/User");
const Post = require("../models/Post");
const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLSchema,
	GraphQLID,
	GraphQLList,
	GraphQLNonNull
} = graphql;

// ----------- TypeDefs  ------------
const { UserType, PostType } = require("./types/index");

// ----------- RootQuery  ------------
const RootQuery = require("./rootQuery/index");

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
				description: { type: GraphQLString },
				author: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve(parent, args) {
				let post = new Post({
					description: args.description,
					author: args.author
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
