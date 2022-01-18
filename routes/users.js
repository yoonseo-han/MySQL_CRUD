const express = require('express');
const User = require('../models/user');
const Comment = require('../models/comment');

const router = express.Router();

router.route('/')
    .get(async(req, res, next) => {
        try {
            const users = await User.findAll();
            //Send the data in from of JSON in response
            res.json(users);
        } catch(err) {
            console.log(err);
            next(err);
        }
    })
    .post(async(req, res, next) => {
        try {
            const user = await User.create({
                name: req.body.name,
                age: req.body.age,
                married : req.body.married,
            });
            console.log(user);
            //201 : Request has succeeded and led to creation of resource
            res.status(201).json(user);
        } catch(err) {
            console.error(err);
            next(err);
        }
    });

//Route directing to comments written by user with certain ID
router.get('/:id/comments', async(req, res, next)=> {
    try{
        //Find all comments in which the comment is from a user with certain id
        const comments = await Comment.findAll({
            include: {
                //model related to comment : user -> Use info from user model
                model: User,
                //where : Conditions are set : Find User with certain ID
                where: {id : req.params.id},
            }, 
        });
        console.log(comments);
        //Send the comments in the form of json in response
        res.json(comments);
    } catch(err) {
        console.error(err);
    }
});

module.exports = router;