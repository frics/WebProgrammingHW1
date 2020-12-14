const express = require('express');
const Message = require('../models/message');
const router = express.Router();

router.get('/', async(req, res) => {
  try{
  var message;
 
  if(req.user){
    message = await Message.find({ to: req.user.UserId}).sort({date: -1});;
  }
  res.render('about', {
    title: "ABOUT",
    messages: message
  });
  }catch(err){
    console.error(err);
    next(err);
  }
});


module.exports = router;