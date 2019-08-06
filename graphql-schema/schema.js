const graphql = require("graphql");
const User = require("../models/User");
const Post = require("../models/Post");

const users = [
	{
		id: "1",
		username: "Saransh Barua",
		network: ["2", "3"]
	},
	{
		id: "2",
		username: "Shivanshu Chourasia",
		network: ["1", "3"]
	},
	{
		id: "3",
		username: "Ching chau",
		network: ["1"]
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
				return posts;
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
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});

// const BookType = new GraphQLObjectType({
// 	name: "Book",
// 	fields: () => ({
// 		id: { type: GraphQLID },
// 		name: { type: GraphQLString },
// 		genre: { type: GraphQLString },
// 		author: {
// 			type: AuthorType,
// 			resolve(parent, args) {
// 				return Author.findById(parent.authorId);
// 			}
// 		}
// 	})
// });

// const AuthorType = new GraphQLObjectType({
// 	name: "Author",
// 	fields: () => ({
// 		id: { type: GraphQLID },
// 		name: { type: GraphQLString },
// 		age: { type: GraphQLInt },
// 		book: {
// 			type: new GraphQLList(BookType),
// 			resolve(parent, args) {
// 				return Book.find({ authorId: parent.id });
// 			}
// 		}
// 	})
// });

//const RootQuery = new GraphQLObjectType({
// 	name: "RootQueryType",
// 	fields: {
// 		book: {
// 			type: BookType,
// 			args: { id: { type: GraphQLID } },
// 			resolve(parent, args) {
// 				// Code to get data from db/json
// 				return Book.findById(args.id);
// 			}
// 		},
// 		author: {
// 			type: AuthorType,
// 			args: { id: { type: GraphQLID } },
// 			resolve(parent, args) {
// 				return Author.findById(args.id);
// 			}
// 		},
// 		books: {
// 			type: GraphQLList(BookType),
// 			resolve(parent, args) {
// 				return Book.find({});
// 			}
// 		},
// 		authors: {
// 			type: GraphQLList(AuthorType),
// 			resolve(parent, args) {
// 				return Author.find({});
// 			}
// 		}
// 	}
// });

// const Mutation = new GraphQLObjectType({
// 	name: "Mutation",
// 	fields: {
// 		addAuthor: {
// 			type: AuthorType,
// 			args: {
// 				name: { type: new GraphQLNonNull(GraphQLString) },
// 				age: { type: new GraphQLNonNull(GraphQLInt) }
// 			},
// 			resolve(parent, args) {
// 				let author = new Author({
// 					name: args.name,
// 					age: args.age
// 				});

// 				return author.save();
// 			}
// 		},
// 		addBook: {
// 			type: BookType,
// 			args: {
// 				name: { type: new GraphQLNonNull(GraphQLString) },
// 				genre: { type: new GraphQLNonNull(GraphQLString) },
// 				authorId: { type: new GraphQLNonNull(GraphQLID) }
// 			},
// 			resolve(parent, args) {
// 				let book = new Book({
// 					name: args.name,
// 					genre: args.genre,
// 					authorId: args.authorId
// 				});

// 				return book.save();
// 			}
// 		}
// 	}
// });
