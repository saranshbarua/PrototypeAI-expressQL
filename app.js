const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./graphql-schema/schema");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const cors = require("cors");

// Connect to mLab database
mongoose
	.connect(process.env.MONGO_URL, { useNewUrlParser: true })
	.then(() => console.log("MongoDB Connected"))
	.catch(err =>
		console.log("Error connecting to database.\nERR:", err.message)
	);
mongoose.connection.once("open", () => console.log("Connected to cloud"));

app.use(
	"/graphql",
	cors(),
	graphqlHTTP({
		schema,
		graphiql: true
	})
);

app.listen(4000, () => {
	console.log(`Serve runnning on port 4000`);
});
