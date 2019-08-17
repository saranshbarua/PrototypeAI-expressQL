const graphql = require("graphql");
const Post = require("../../models/Post");
const User = require("../../models/User");

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

const UserType = new GraphQLObjectType({
	name: "User",
	fields: () => ({
		id: { type: GraphQLID },
		username: { type: GraphQLString },
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
