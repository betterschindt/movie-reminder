var config = require('../../config');
var User = require('../models/user');
var Reminder = require('../models/reminder');
var jwt = require('jsonwebtoken');

var superSecret = config.secret;

module.exports = function(app, express) {
    var apiRouter = express.Router();

    //send username and password for authentication and receive JWT token
    apiRouter.post('/authenticate', function (req, res) {
        //get first document matching unique username
        //then select
        User.findOne({
            username: req.body.username
        }).select('name username password').exec(function (err, user) {
            if (err)
                throw err;
            if (!user) { //no user was found
                res.json({
                    success: false,
                    message: 'user not found'
                });
            } else if (user) {
                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    res.json({
                        success: false,
                        message: 'wrong password'
                    });
                } else {
                    //found user and password was correct
                    var token = jwt.sign({
                        name: user.name,
                        username: user.username
                    }, superSecret, {
                        expiresInMinutes: 1440
                    });

                    //return info and token
                    res.json({
                        success: true,
                        message: 'token created',
                        token: token
                    });
                }
            }

        });
    });

    //middleware
    apiRouter.use(function (req, res, next) {
        console.log('someone came to our app');
        //authenticate user
        //get token

        var token = req.body.token || req.param('token') || req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, superSecret, function (err, decoded) {
                if (err) {
                    return res.status(403).send({
                        success: false,
                        message: 'failed to authenticate token'
                    });
                } else {
                    req.decoded = decoded;
                    console.log('req.decoded saved');
                    next();
                }
            });
        } else {
            //
            next();
            /*
            //no token was found
            return res.status(403).send({
                success: false,
                message: 'no token found'
            });
            */
        }

    });

    apiRouter.route('/signup')
        .post(function(req,res){
            console.log('to signup');
            var user = new User();
            user.name = req.body.name;
            user.username = req.body.username;
            user.password = req.body.password;
            user.reminders = [];


            user.save(function (err) {
                if (err) {
                    //if duplicate
                    if (err.code == 11000)
                        return res.json({success: false, message: 'already taken'});
                    else
                        return res.send(err);
                }
                res.json({message: 'user created'});
            })
        });

    apiRouter.route('/users')
        .post(function (req, res) {
            //create instance of user model
            var user = new User();
            user.name = req.body.name;
            user.username = req.body.username;
            user.password = req.body.password;

            user.save(function (err) {
                if (err) {
                    //if duplicate
                    if (err.code == 11000)
                        return res.json({success: false, message: 'already taken'});
                    else
                        return res.send(err);
                }
                res.json({message: 'user created'});
            })
        })
        .get(function (req, res) {
            User.find(function (err, users) {
                if (err)
                    res.send(err);
                res.json(users);
            })
        });


    apiRouter.route('/users/reminders')
        .put(function (req, res) {

            User.findOne({username:req.body.username}, function (err, user) {
                if (err)
                    res.send(err);
                //update info
                if (req.body.reminders)
                    user.reminders = req.body.reminders;

                // save the user
                user.save(function (err) {
                    if (err)
                        return res.send(err);
                    // return a message
                    res.json({message: 'reminder added!'});
                });
            });

        });

    apiRouter.route('/users/:user_id')
        .get(function (req, res) {
            User.findById(req.params.user_id, function (err, user) {
                if (err)
                    res.send(err);
                res.json(user);
            })
        })
        .put(function (req, res) {
            User.findById(req.params.user_id, function (err, user) {
                if (err)
                    res.send(err);
                //update info
                if (req.body.name)
                    user.name = req.body.name;
                if (req.body.username)
                    user.username = req.body.username;
                if (req.body.password)
                    user.password = req.body.password;
                // save the user
                user.save(function (err) {
                    if (err)
                        return res.send(err);

                    // return a message
                    res.json({message: 'User updated!'});
                });
                //res.json({message:'user updated'});
            });
        })
        .delete(function (req, res) {
            User.remove({
                _id: req.params.user_id
            }, function (err, user) {
                if (err)
                    return res.send(err);
                res.json({message: 'deleted'});
            });
        });

    apiRouter.route('/reminders')
        .post(function (req, res) {
            //create instance of user model
            var reminder = new Reminder();
            reminder.title = req.body.title;
            reminder.director = req.body.director;
            reminder.shortdesc = req.body.shortdesc;

            reminder.save(function (err) {
                if (err) {
                    //if duplicate
                    if (err.code == 11000)
                        return res.json({success: false, message: 'already have a reminder'});
                    else
                        return res.send(err);
                }
                res.json({message: 'user created'});
            })
        })
        .get(function (req, res) {
            console.log('called get function for reminders');
            Reminder.find(function (err, reminders) {
                if (err)
                    res.send(err);
                res.json(reminders);
            })
        });

    apiRouter.get('/me', function(req, res) {
        User.findOne({username:req.decoded.username}, function (err, user) {
            if (err)
                res.send(err);
            res.send(user);
        });
    });

    return apiRouter;
};