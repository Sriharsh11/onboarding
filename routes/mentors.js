const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Mentor = require('../models/mentor');
const bcrypt = require('bcryptjs');

router.get('/mentor/register',function(req,res){
    res.send('register here, mentor');
});

router.post('/mentor/register',function(req,res){
    const {name, email, password, password2,slots} = req.body;
    if(!name||!email||!password||!password2||!slots){
        res.send('fill all fields');
    } else {
        Mentor.findOne({email:email},function(err,mentor){
            if(err) console.log(err);
            else{
                if(mentor){
                    res.send('email already exists');
                } else {
                    const newMentor = new Mentor({
                        name,
                        email,
                        password,
                        slots
                    });
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newMentor.password, salt, (err, hash) => {
                          if (err) throw err;
                          newMentor.password = hash;
                          newMentor
                            .save()
                            .then(user => {
                            //   res.send('created new mentor');
                              jwt.sign({user}, 'secretkey',{ expiresIn: '180s' }, (err, token) => {
                                res.json({
                                token
                                });
                            });
                            })
                            .catch(err => console.log(err));
                        });
                      });
                }
            }
        })
    }
})

// mentor login 
router.get('/mentor/login',verifyToken,function(req,res){
    jwt.verify(req.token,'secretkey',function(err,authData){
        if(err) res.send('login here');
        else{
             res.redirect('/dashboard');
        }
    })
})

router.post('/mentor/login',function(req,res){
    var {email,password} = req.body;
    Mentor.findOne({email:email},function(err,user){
        if(err) res.send('mentor doesnt exist');
        else{
            jwt.sign({user}, 'secretkey',{ expiresIn: '180s' }, (err, token) => {
                res.json({
                    token
                    });
                  });
                }
            })
        })

router.get('/mentor/dashboard',verifyToken,function(req,res){
    jwt.verify(req.token,'secretkey',function(err,authData){
        if(err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'welcome to your dashboard,mentor',
                authData
            })
        }
    })
})        

router.put('/mentor/dashboard',function(req,res){
    console.log(req.body);
    var {name,email,password} = req.body;
    Mentor.findOne({email:email},function(err,user){
        if(err) res.send('user does not exist');
        else {
            console.log(user);
            user.email = email;
            user.name = name;
            user.password = password;
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(user.password, salt, (err, hash) => {
                    if (err) throw err;
                    user.password = hash;
                    user
                    .save()
                    .then(user => {
                        res.send('created entry');
                    })
                    .catch(err => console.log(err));
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