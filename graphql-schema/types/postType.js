const graphql = require("graphql");
const UserType = require("./userType");

const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;

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

module.exports = PostType;
