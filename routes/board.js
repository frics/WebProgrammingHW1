const express = require('express');
const moment = require("moment");
const Message = require('../models/message');
const Hashtag = require('../models/hashtag');
const Board = require('../models/board');

const router = express.Router();

const { isLoggedIn } = require('./middlewares');



router.post('/post', isLoggedIn, async (req, res, next) => {
  try {
    const board = await Board.create({
      title: req.body.title,
      writer: req.user.UserId,
      content: req.body.content,
    });
    
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(async tag => {
          const check = await Hashtag.findOne({ title: tag.slice(1).toLowerCase() });

          if(!check){
            await Hashtag.create({ title: tag.slice(1).toLowerCase() });
          }
          return;
        }),
      );
      
    }
    
    res.redirect('/board');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/page', async(req, res, next) =>{
  try {
    console.log(req.body);
    var post = await Board.findOne({ _id: req.body._id});
    console.log(post);

    const date = moment(post.createdAt).format('YYYY MMMM Do , hh:mm');
    
    console.log(date);
    res.render('page', {
      board : post,
      date: date,
    });
  }catch (err) {
    console.error(err);
    next(err);
  }
});

router.post('/modify',isLoggedIn, async(req, res, next)=>{
  try{
    console.log("수정할 내용 확인");
    console.log(req.body);
     const board = await Board.updateOne(
       { _id:req.body._id },
       { title: req.body.title, content: req.body.content }
    );
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(async tag => {
          const check = await Hashtag.findOne({ title: tag.slice(1).toLowerCase() });

          if(!check){
            await Hashtag.create({ title: tag.slice(1).toLowerCase() });
          }
          return;
        }),
      );
    }
    
    res.redirect('/board');
    
  }catch(err){
    console.error(err);
    next(err);
  }
    
});


router.post('/delete',isLoggedIn, async(req, res, next)=>{
  try{
 
    await Board.deleteOne({_id:req.body._id});
   
    //res.json(board);
    res.redirect('/board');
  }catch(err){
    console.error(err);
    next(err);
  }
    
});

router.get('/search', async (req, res, next) => {
  const query = req.query.search;
  const type = req.query.type;
  var board;

 
  if (!query) {
    return res.redirect('/');
  }
  try {
    if(type === "content"){
      //내용 검색
      board = await Board.find({ content: {$regex: query}});
    }else if(type === "writer"){
      //작성자 검색
      board = await Board.find({ writer: query});
    }else{
      //HASH TAG 검색
      const hashtag = await Hashtag.findOne({ title: query  });
      if (hashtag) {
        board = await Board.find( {content:{$regex: '.*#'+query+'.*'}});
      }
    }
    
    return res.render('board', {
      title: `${type} | ${query} | 검색결과`,
      boards: board,
      type: type,
      query: query,
    });

  } catch (error) {
    console.error(error);
    return next(error);
  }
});


router.get('/', async (req, res, next) => {
  try {
    var message;
 
    if(req.user){
      message = await Message.find({ to: req.user.UserId}).sort({date: -1});;
    }
    const board = await Board.find({}).sort({createdAt: -1});;

    res.render('board', {
      title: "BOARD",
      boards: board,
      messages: message
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});



module.exports = router;