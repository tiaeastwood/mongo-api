const { MongoClient } = require("mongodb");

// connect to the MongoDB database

let dbConnection;

module.exports = {
	connectToDb: (cb) => {
		MongoClient.connect("mongodb://localhost:27017/cat")
			.then((client) => {
				dbConnection = client.db();
				return cb();
			})
			.catch((err) => {
				console.log(err);
				return cb(err);
			});
	},
	getDb: () => dbConnection,
};
