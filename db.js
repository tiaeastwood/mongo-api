import { MongoClient } from "mongodb";
import testCredentials from "./credentials.js";

const username = testCredentials.username;
const password = testCredentials.password;

// connect to the MongoDB database

let dbConnection;

const uri = `mongodb+srv://${username}:${password}@cluster0.nnxalll.mongodb.net/?retryWrites=true&w=majority`;

export const connectToDb = (cb) => {
	MongoClient.connect(uri)
		.then((client) => {
			dbConnection = client.db();
			return cb();
		})
		.catch((err) => {
			console.log(err);
			return cb(err);
		});
};

export const getDb = () => dbConnection;
