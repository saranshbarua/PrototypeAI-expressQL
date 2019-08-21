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
		addUserToNetwork: {
			type: UserType,
			args: {
				username: { type: new GraphQLNonNull(GraphQLString) },
				userToAdd: { type: new GraphQLNonNull(GraphQLString) }
			},
			async resolve(parent, args) {
				const result = await User.findOneAndUpdate(
					{ username: args.username },
					{ $push: { network: args.userToAdd } },
					{ new: true, useFindAndModify: false, safe: true, upsert: true }
				);
				return result;
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
		},
		sendRequest: {
			type: UserType,
			args: {
				sender: { type: GraphQLString },
				recipient: { type: GraphQLString }
			},
			async resolve(parent, args) {
				try {
					// Add to recipient's pending request
					const recipientUpdate = await User.findOneAndUpdate(
						{ username: args.recipient },
						{ $push: { pendingRequest: args.sender } },
						{ new: true, useFindAndModify: false, safe: true, upsert: true }
					);
					// Add to sender's sent request
					const senderUpdate = await User.findOneAndUpdate(
						{ username: args.sender },
						{ $push: { sentRequest: args.recipient } },
						{ new: true, useFindAndModify: false, safe: true, upsert: true }
					);
					return senderUpdate;
				} catch (e) {
					console.error(e);
				}
			}
		}
	}
});

module.exports = Mutation;
