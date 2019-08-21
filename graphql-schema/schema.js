const graphql = require("graphql");
const { GraphQLSchema } = graphql;

// RootQuery
const RootQuery = require("./rootQuery/index");

// Mutations
const Mutation = require("./mutations/index");

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});
