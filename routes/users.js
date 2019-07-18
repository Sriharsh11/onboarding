const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

//register get route
router.get('/register',function(req,res){
    res.send('register here');
});

//register post route
router.post('/register',function(req,res){
    const {name, email, password, password2} = req.body;
    if(!name||!email||!password||!password2){
        res.send('enter all fields');
    } else {
        User.findOne({email:email},function(err,user){
            if(err) console.log(err);
            else{
                if(user){
                    res.send('email already exists');
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                      });
                      bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                          if (err) throw err;
                          newUser.password = hash;
                          newUser
                            .save()
                            .then(user => {
                              res.send('created entry');
                            })
                            .catch(err => console.log(err));
                        });
                      });
                }
            }
        })
    }
})

//dashboard route(protected route)
router.get('/dashboard',verifyToken,function(req,res){
    jwt.verify(req.token,'secretkey',function(err,authData){
        if(err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'welcome to your dashboard',
                authData
            })
        }
    })
})

//login route
router.get('/login',verifyToken,function(req,res){
    jwt.verify(req.token,'secretkey',function(err,authData){
        if(err) res.send('login here');
        else{
                res.redirect('/dashboard');
            
        }
    })
});

//login post route
router.post('/login',function(req,res){
    var {email,password} = req.body;
    User.findOne({email:email},function(err,user){
        if(err) res.send('user doesnt exist');
        else{
                jwt.sign({user}, 'secretkey',{ expiresIn: '60s' }, (err, token) => {
                    res.json({
                      token
                    });
                  });
        }
    })
})

function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
      // Split at the space
      const bearer = bearerHeader.split(' ');
      // Get token from array
      const bearerToken = bearer[1];
      // Set the token
      req.token = bearerToken;
      // Next middleware
      next();
    } else {
      // Forbidden
      res.sendStatus(403);
    }
  
  }

module.exports = router;