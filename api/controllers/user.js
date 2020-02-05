
// Import User Model
const User = require('../models/user');

// Import Mongoose to generate Id
const mongoose = require('mongoose');

// Importing bcrypt to hash the password to prevent any sort of users from seeing plain password
const bcrypt = require('bcryptjs');

// JWT
const jwt = require('jsonwebtoken');

exports.get_all_users = (req, res, next) => {
    User.find().select('_id email')
    .exec()
    .then( data => {
        res.status( 200 ).json({
            count: data.length,
            UsersList: data.map( set => {
                return {
                    userDetails: {
                        _id: set._id,
                        email: set.email
                    },
                    request: {
                        type: 'POST',
                        description: 'To Signin',
                        url: 'http://localhost:3000/users/signin/',
                        body: { email: 'String', password: 'String' }
                    }
                }
            })
        })
    })
    .catch( err => {
        res.status( 500 ).json({
            message: 'Something went wrong while fetching all users',
            log: err
        })
    })
}

exports.user_signup = (req, res, next) => {
    const salt = bcrypt.genSaltSync(10);
    const password = req.body.password;
    User.findOne({ email: req.body.email })
        .exec()
        .then(data => {
            if (!data) { //data will be null if no user found for the posted email in body
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) {
                        res.status(500).json({
                            message: err
                        })
                    }
                    if (hash) {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId,
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(data => {
                                res.status(201).json({
                                    message: 'User Created',
                                    createdUser: {
                                        _id: data._id,
                                        email: data.email
                                    },
                                    request: {
                                        type: 'POST',
                                        description: 'Try Signin',
                                        url: 'http://localhost:3000/users/signin/',
                                        body: { email: 'String', password: 'String' }
                                    }
                                })
                            }).catch(err => {
                                res.status(500).json({
                                    error: err
                                })
                            })
                    }
                });
            } else {
                res.status(409).json({
                    message: 'user Already Exist',
                    request: {
                        type: 'POST',
                        description: 'Try Signin',
                        url: 'http://localhost:3000/users/signin/',
                        body: { email: 'String', password: 'String' }
                    }
                })
            }
        })
        .catch(err => {
            console.log(err);
        })

}

exports.user_delete = (req, res, next) => {
    console.log( req.body );
    const id = req.params.userId;
    User.findOne({ _id: id }).exec()
        .then(data => {
            if (data) {
                User.deleteOne({ _id: id }).exec()
                    .then(data => {
                        res.status(200).json({
                            message: 'User Succesfully Deleted'
                        })
                    })
                    .catch( err => {
                        res.status(500).json({
                            message: 'Something went wrong while deleting',
                            log: err
                        })
                    })
            } else {
                res.status(404).json({
                    message: 'User does not exist to delete'
                })
            }
        })
        .catch( err => {
            res.status( 500 ).json({
                message: 'Something went wrong while fetching user info for the userId',
                log: err
            })
        })

}

exports.user_signin = (req, res, next) => {
    User.findOne({ email: req.body.email }).exec()
        .then(data => {
            bcrypt.compare(req.body.password, data.password, (err, result) => {
                if (result == true) {
                    const token = jwt.sign(
                        { _id: data._id, email: data.email },
                        process.env.jwt_key,
                        { expiresIn: '2h' }
                    );
                    console.log(token);
                    res.status(200).json({
                        message: 'Login Success',
                        token: token
                    })
                } else {
                    res.status(500).json({
                        message: 'Auth Failed',
                        log: data
                    })
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                message: 'Auth Failed',
                error: err
            })
        })
};