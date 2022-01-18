const express = require('express');
const User = require('../models/user')

const router = express.Router();

//Get request for user
router.get('/', async(req, res, next)=> {
    try{
        //Get all info of users using User.findAll
        const users = await User.findAll();
        //Input the user when rendering sequelize.html to use 
        res.render('sequelize', { users });
    } catch(err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;