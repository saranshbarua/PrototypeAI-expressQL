const graphql = require("graphql");
const Post = require("../../models/Post");
const User = require("../../models/User");

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const UserType = new GraphQLObjectType({
	name: "User",
	fields: () => ({
		id: { type: GraphQLID },
		username: { type: GraphQLString },
		displayName: { type: GraphQLString },
		userAvatar: { type: GraphQLString },
		coverPhoto: { type: GraphQLString },
		designation: { type: GraphQLString },
		bio: { type: GraphQLString },
		email: { type: GraphQLString },
		password: { type: GraphQLString },
		location: { type: GraphQLList(GraphQLString) },
		interests: { type: GraphQLList(GraphQLString) },
		skills: { type: GraphQLList(GraphQLString) },
		network: { type: GraphQLList(GraphQLString) },
		pendingRequest: { type: GraphQLList(GraphQLString) },
		sentRequest: { type: GraphQLList(GraphQLString) },
		posts: {
			type: new GraphQLList(PostType),
			resolve(parent, args) {
				return Post.find({ author: parent.username });
			}
		},
		network: {
			type: new GraphQLList(UserType),
			resolve(parent, args) {
				let promises = [];
				for (let i = 0; i < parent.network.length; i++) {
					let promise = new Promise(function(resolve, reject) {
						User.findOne({ username: parent.network[i] }, function(err, res) {
							if (err) {
								reject(err);
							} else {
								resolve(res);
							}
						});
					});
					promises.push(promise);
				}
				return Promise.all(promises).then(res => res);
			}
		}
	})
});

module.exports = UserType;

// This is here to prevent circular dependencies problem which will lead to the formation of infinite loop
const PostType = require("./postType");
