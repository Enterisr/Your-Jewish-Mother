const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 6969;
const MongoClient = require('mongodb').MongoClient;
const dbUrl = process.env.MONGO_URI;
app.use(cors());
app.use(express.json());

function selectRandomFromArray(arr) {
	const rnd = Math.floor(Math.random() * arr.length);
	return arr[rnd];
}
app.post('/RegisterIp', async (req, res) => {
	try {
		let db = await MongoClient.connect(dbUrl);
		await db.db('your-jewish-mother').collection('user').insertOne({ ip, assertivness: 0 });
		res.send(true);
	} catch (ex) {
		res.send(false);
		throw ex;
	}
});
app.post('/isBlackSite', async (req, res) => {
	//this is expensive for the server, but we need it cause we don't know if the user will decide to fool around...
	let ip = req.ip;
	let url = sanitize(req.body.url);
	url = new URL(url);
	try {
		let db = await MongoClient.connect(dbUrl);
		const user = await db.db('your-jewish-mother').collection('user').findOne({ ip });
		let isBlackSite = user.black_sites.find((blackSite) => {
			let blackSiteUrl = new URL(blackSite);
			return blackSiteUrl.hostname == url.hostname;
		});

		res.send({ isBlackSite: isBlackSite != undefined, assertivness: user.assertivness });
	} catch (ex) {
		res.send(false);
		throw ex;
	}
});
app.get('/giveMeSomeThingToSay', (req, res) => {
	fs.readFile('sentences.json', (err, sentences) => {
		let sentencesArray = JSON.parse(sentences).messages;
		console.log('sending...');
		res.send(selectRandomFromArray(sentencesArray));
	});
});
app.get('/GetUserInfo', async (req, res) => {
	let ip = req.ip;
	try {
		const levels = [ 'soft kitty', 'your mom', "your friend's mom", 'Golda Meir', 'HARSH LOVE' ];
		let db = await MongoClient.connect(dbUrl);
		let user = await db.db('your-jewish-mother').collection('user').findOne({ ip });
		let data = { user, levels };
		res.send(data);
	} catch (ex) {
		res.send(false);
		throw ex;
	}
});
app.post('/PostNewBlackSite', async (req, res) => {
	let ip = req.ip;
	try {
		let db = await MongoClient.connect(dbUrl);
		let url = sanitize(req.body.url);
		await db.db('your-jewish-mother').collection('user').updateOne({ ip }, { $addToSet: { black_sites: url } });
		res.send(true);
	} catch (ex) {
		res.status(500).send('there was an error!');
		throw ex;
	}
});
app.post('/UpdateAssertivness', async (req, res) => {
	let ip = req.ip;
	try {
		let db = await MongoClient.connect(dbUrl);
		let assertivness = sanitize(req.body.assertivness);
		await db.db('your-jewish-mother').collection('user').updateOne({ ip }, { $set: { assertivness } });
		res.send(true);
	} catch (ex) {
		res.status(500).send('there was an error!');
		throw ex;
	}
});
app.listen(port, () => console.log(`your-jewish mother server running on port ${port}`));
function sanitize(v) {
	if (v instanceof Object) {
		for (var key in v) {
			if (/^\$/.test(key)) {
				delete v[key];
			} else {
				sanitize(v[key]);
			}
		}
	}
	return v;
}
