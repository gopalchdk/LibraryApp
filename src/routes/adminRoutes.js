const express = require('express');
const {MongoClient} = require('mongodb')
const debug = require('debug')('app:adminRoutes');
const adminRouter = express.Router();

const books = [
    {
        title: "Veronica decides to die",
        author: "Paulo Coelho"
    }, {
        title: "The Alchemist",
        author: "Paulo Coelho"
    }, {
        title: "The inner engineering",
        author: "Sadhguru"
    }, {
        title: "Da Vinci Code",
        author: "Dan Brown"
    }
];

function router(nav) {
    adminRouter
        .route('/')
        .get((req, res) => {
            const url = 'mongodb://localhost:27017';
            const dbName = 'libraryApp';
            (async function mongo() {
                let client;
                try {
                    client = await MongoClient.connect(url);
                    debug("Connected to mongo sucessfully");

                    const db = client.db(dbName);

                    const response = await db
                        .collection('books')
                        .insertMany(books);

                    res.json(response);

                } catch (err) {
                    debug(err);
                }

                client.close();
            }())
        });
    return adminRouter;
};

module.exports = router;