const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Mentor = require('../models/mentor');
const bcrypt = require('bcryptjs');


// function initializeRoutes(router){
    router.get('/register',function(req,res){
        res.send('register here');
    });
    
    //register post route
    router.post('/register',function(req,res){
        const {name, email, password, password2} = req.body;
        console.log(req.body);
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
                                //   res.send('created entry');
                                console.log("created new entry");
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
        console.log(req.body);
        var {email,password} = req.body;
        console.log(email);
        User.findOne({email:email},function(err,user){
            if(err) res.send('user doesnt exist');
            else{
            jwt.sign({user}, 'secretkey',{ expiresIn: '180s' }, (err, token) => {
                res.json({
                token
                });
            });
            }
        })
    })
    
    //put request for user to edit details
    router.put('/dashboard',function(req,res){
        console.log(req.body);
        var {name,email,password} = req.body;
        User.findOne({email:email},function(err,user){
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
                // user.save(function(err){
                //     if(err) console.log(err);
                //     else {
                //         res.redirect('/dashboard');
                //     }
                // })
            }
        })
    })
    
    
    
    
    
   // mentor signup 
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
    
    //routes for selecting slots   
    router.get('/slots',verifyToken,function(req,res){
        jwt.verify(req.token,'secretkey',function(err,authData){
            if(err) {
                res.sendStatus(403);
            } else {
                Mentor.find({},function(err,mentor){
                    if(err) res.send('no slots');
                    else {
                        for(var i=0;i<mentor.length;i++){
                            console.log(mentor[i].slots);
                        }
                        res.send('list of slots');
                    }
                }) 
            }
        })
    })
    
    //route for selecting time slot
    router.post('/slots',function(req,res){
        var slot = req.body.slots;
        Mentor.findOneAndUpdate({slots:slot},{$pull : {slots:slot}},function(err,result){
            if(err) res.send(err);
            else res.send('slot set successfully');
        })
    });


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
// }

//register get route


module.exports = router;