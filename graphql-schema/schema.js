const graphql = require("graphql");

const users = [
	{
		id: "1",
		username: "Saransh Barua"
	},
	{
		id: "2",
		username: "Shivanshu Chourasia"
	}
];

const posts = [
	{
		id: "1",
		author: "1",
		description: "POST1"
	},
	{
		id: "2",
		author: "1",
		description: "POST2"
	},
	{
		id: "3",
		author: "1",
		description: "POST3"
	},
	{
		id: "5",
		author: "2",
		description: "POST4"
	},
	{
		id: "6",
		author: "2",
		description: "POST5"
	}
];

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
		id: { type: GraphQLID },
		username: { type: GraphQLString },
		// displayName: { type: new GraphQLNonNull(GraphQLString) },
		// userAvatar: { type: GraphQLString },
		// email: { type: GraphQLString },
		// password: { type: GraphQLString },
		// interests: { type: new GraphQLList(GraphQLString) },
		// skills: { type: new GraphQLList(GraphQLString) },
		// set: { type: GraphQLString },
		// designation: { type: GraphQLString },
		// bio: { type: GraphQLString },
		// network: { type: new GraphQLList(UserType) },
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
				return users;
			}
		},
		//  Return all posts
		posts: {
			type: GraphQLList(PostType),
			resolve(parent, args) {
				return posts;
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery
});
