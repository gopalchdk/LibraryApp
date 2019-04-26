const passport = require('passport');
const {Strategy} = require('passport-local');
const {MongoClient} = require('mongodb');
const debug = require('debug')('app:local');

module.exports = function localStrategy() {
    passport.use(new Strategy({
        usernameField: 'userid',
        passwordField: 'password'
    }, (username, password, done) => {
        const url = 'mongodb://localhost:27017';
        const dbName = 'libraryApp';

        (async function mongo() {
            let client;
            try {
                client = await MongoClient.connect(url);
                debug('conncted to db');
                let db = client.db(dbName);
                let col = db.collection('users');
                const user = await col.findOne({username});
                if (user.password === password) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            } catch (err) {
                debug(err.stack);
            }
            client.close();
        }());

    }))
}