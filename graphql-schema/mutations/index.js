const graphql = require("graphql");
const User = require("../../models/User");
const Post = require("../../models/Post");

const { UserType, PostType } = require("../types/index");

const { GraphQLObjectType, GraphQLString, GraphQLNonNull } = graphql;

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

module.exports = Mutation;
