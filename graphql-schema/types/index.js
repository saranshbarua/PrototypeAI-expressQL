const graphql = require("graphql");
const User = require("../../models/User");
const Post = require("../../models/Post");

const UserType = require("./userType");
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

module.exports = { UserType, PostType };
