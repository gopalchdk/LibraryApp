const express = require('express');
const {MongoClient} = require('mongodb');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');

const authRouter = express.Router();

function router(nav) {
    authRouter
        .route('/signUp')
        .post((req, res) => {
            const {userid, password} = req.body;
            let server = 'mongodb://localhost:27017';
            let dbName = 'libraryApp';
            (async function addUser() {
                let client;
                try {
                    client = await MongoClient.connect(server);
                    debug('Connected sucessfully');

                    let db = client.db(dbName);
                    let col = db.collection('users');
                    const user = {
                        username: userid,
                        password
                    }
                    let result = await col.insertOne(user);
                    debug(result);
                    req.login(result.ops[0], () => {
                        res.redirect('/auth/profile');
                    })
                } catch (err) {
                    debug(err.stack);
                }
            }())

        });
    authRouter
        .route('/signIn')
        .get((req, res) => {
            res.render('signIn', {nav, title: 'Sign In'});
        })
        .post(passport.authenticate('local',{
            successRedirect:'/auth/profile',
            failureRedirect:'/'
        }));
    authRouter
        .route('/profile')
        .all((req,res,next)=>{
            if(req.user){
                next();
            }else{
                res.redirect('/');
            }
        })
        .get((req, res) => {
            res.json(req.user);
        })
    return authRouter;
}

module.exports = router;