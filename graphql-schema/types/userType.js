const graphql = require("graphql");
const User = require("../../models/User");
const Post = require("../../models/Post");
const PostType = require("./postType");

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

module.exports = UserType;
