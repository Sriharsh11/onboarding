const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Mentor = require('../models/mentor');
const bcrypt = require('bcryptjs');

router.get('/slots',verifyToken,function(req,res){
    jwt.verify(req.token,'secretkey',function(err,authData){
        if(err) {
            res.sendStatus(403);
        } else {
            Mentor.find({},function(err,mentor){
                if(err) res.send('no slots');
                else {
                    var listofSlots = [];
                    for(var i=0;i<mentor.length;i++){
                        listofSlots.push(mentor[i].slots);
                    }
                    res.json(listofSlots);
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

  module.exports = router;