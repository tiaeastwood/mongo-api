import express from "express"
import { ObjectId } from "mongodb"
import { connectToDb, getDb } from "./db.js"

// init app and middleware
const app = express();
app.use(express.json());

const PORT = 3000;

// db connection
let db;

connectToDb((err) => {
	if (!err) {
		app.listen(PORT, () => {
			console.log(`app listening on ${PORT}`);
		});
		db = getDb();
	}
});

// routes
app.get("/cats", (req, res) => {
	const page = req.query.p || 0; // current page - use query parameter, or if there isn't one use 0 to get first page
	const catsPerPage = 3; // how many items to show per page

	let cats = [];

	db.collection("cats")
		.find()
		.sort({ name: 1 })
		.skip(page * catsPerPage)
		.limit(catsPerPage)
		.forEach((cat) => cats.push(cat))
		.then(() => {
			res.status(200).json(cats);
		})
		.catch(() => {
			res.status(500).json({ error: "could not fetch the documents" });
		});
});

app.get("/cats/:id", (req, res) => {
	// only try to get the document if the id is valid
	// if id is valid but doc doesnt exist, it will return null
	if (ObjectId.isValid(req.params.id)) {
		db.collection("cats")
			.findOne({ _id: ObjectId(req.params.id) })
			.then((doc) => {
				res.status(200).json(doc);
			})
			.catch((err) => {
				res.status(500).json({ error: "could not fetch the document" });
			});
	} else {
		res.status(500).json({ error: "Not a valid document id" });
	}
});

app.post("/cats", (req, res) => {
	const cat = req.body;

	db.collection("cats")
		.insertOne(cat)
		.then((result) => {
			res.status(201).json(result);
		})
		.catch((err) => {
			res.status(500).json({ err: "Could not create a new document" });
		});
});

app.delete("/cats/:id", (req, res) => {
	if (ObjectId.isValid(req.params.id)) {
		db.collection("cats")
			.deleteOne({ _id: ObjectId(req.params.id) })
			.then((doc) => {
				res.status(200).json(doc);
			})
			.catch((err) => {
				res.status(500).json({ error: "could not delete the document" });
			});
	} else {
		res.status(500).json({ error: "Not a valid document id" });
	}
});

app.patch("/cats/:id", (req, res) => {
	const updates = req.body;

	if (ObjectId.isValid(req.params.id)) {
		db.collection("cats")
			.updateOne({ _id: ObjectId(req.params.id) }, { $set: updates })
			.then((doc) => {
				res.status(200).json(doc);
			})
			.catch((err) => {
				res.status(500).json({ error: "could not update the document" });
			});
	} else {
		res.status(500).json({ error: "Not a valid document id" });
	}
});

// in node, find() returns a cursor, which points to the documents - you can then use toArray to put them in an array, or forEach to do something for each one
