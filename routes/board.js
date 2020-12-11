const express = require('express');
const moment = require("moment");

const Board = require('../models/board');

const router = express.Router();

const { isLoggedIn } = require('./middlewares');

router.get('/post', isLoggedIn, async(req,res,next)=>{
   
      res.render('post', {});    
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
})

router.post('/post', isLoggedIn, async (req, res, next) => {
  try {
    const board = await Board.create({
      title: req.body.title,
      writer: req.user.UserId,
      content: req.body.content,
    });
    
    //const hashtags = req.body.content.match(/#[^\s#]*/g);
    /*
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          })
        }),
      );
      
      await post.addHashtags(result.map(r => r[0]));
    }
    */
    res.redirect('/board');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/modify',isLoggedIn, async(req, res, next)=>{
  try{
    console.log("수정할 내용 확인");
    console.log(req.body);
     const board = await Board.update(
       { _id:req.body._id },
       { title: req.body.title, content: req.body.content }
    );
    //res.json(board);
    req.par = req.body._id;
    res.redirect(307, '/board/page');
  }catch(err){
    console.error(err);
    next(err);
  }
    
});


router.post('/delete',isLoggedIn, async(req, res, next)=>{
  try{
    console.log("삭제할 내용 확인");
    console.log(req.body);
    const board = await Board.deleteOne({_id:req.body._id});
   
    //res.json(board);
    res.redirect('/board');
  }catch(err){
    console.error(err);
    next(err);
  }
    
});


router.get('/', async (req, res, next) => {
  try {
    const board = await Board.find({});

    res.render('board', {
      boards: board,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});



module.exports = router;