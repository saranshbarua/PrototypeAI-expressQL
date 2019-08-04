const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./graphql-schema/schema");
const app = express();
const cors = require("cors");

app.use(
	"/graphql",
	cors(),
	graphqlHTTP({
		schema,
		graphiql: true
	})
);

app.listen(process.env.PORT || 4000, () => {
	console.log(`Serve runnning on port ${process.env.PORT || 4000}`);
});
