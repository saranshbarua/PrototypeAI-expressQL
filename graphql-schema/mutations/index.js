const graphql = require("graphql");
const User = require("../../models/User");
const Post = require("../../models/Post");
const TIMELINE_LIMIT = 5;
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
			async resolve(parent, args) {
				let post = new Post({
					description: args.description,
					author: args.author
				});
				let newPost = await post.save();
				let postAuthor = await User.findOne({ username: args.author });
				// Removes old posts from timeline (limit can be increased)
				if (postAuthor.timeline.length >= TIMELINE_LIMIT) {
					postAuthor.timeline.shift();
				}
				postAuthor.timeline.push(newPost._id);
				await postAuthor.save();
				postAuthor.network.map(async user => {
					let connection = await User.findOne({ username: user });
					if (connection.timeline.length >= TIMELINE_LIMIT) {
						connection.timeline.shift();
					}
					connection.timeline.push(newPost._id);
					await connection.save();
				});
				return newPost;
			}
		},
		// Send connection request
		sendRequest: {
			type: UserType,
			args: {
				sender: { type: GraphQLString },
				recipient: { type: GraphQLString }
			},
			async resolve(parent, args) {
				try {
					// Add to recipient's pending request
					await User.findOneAndUpdate(
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
		},
		// Accept connection request
		acceptRequest: {
			type: UserType,
			args: {
				sender: { type: GraphQLString },
				recipient: { type: GraphQLString }
			},
			async resolve(parent, args) {
				try {
					// Add to reciepent's network
					await User.findOneAndUpdate(
						{ username: args.recipient },
						{ $push: { network: args.sender } },
						{ new: true, useFindAndModify: false, safe: true, upsert: true }
					);
					// Add to sender's network
					await User.findOneAndUpdate(
						{ username: args.sender },
						{ $push: { network: args.recipient } },
						{ new: true, useFindAndModify: false, safe: true, upsert: true }
					);
					// Remove from recipient's pending request
					await User.findOneAndUpdate(
						{ username: args.recipient },
						{ $pull: { pendingRequest: args.sender } },
						{ new: true, useFindAndModify: false, safe: true, upsert: true }
					);
					// Remove from sender's sent request
					await User.findOneAndUpdate(
						{ username: args.sender },
						{ $pull: { sentRequest: args.recipient } },
						{ new: true, useFindAndModify: false, safe: true, upsert: true }
					);
					// Return recipient
					const updatedRecipient = await User.findOne({
						username: args.recipient
					});
					return updatedRecipient;
				} catch (e) {
					console.error(e);
				}
			}
		}
	}
});

module.exports = Mutation;
