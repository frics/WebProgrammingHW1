const express = require('express');
const moment = require("moment");
const Message = require('../models/message');
const Hashtag = require('../models/hashtag');
const Board = require('../models/board');
const Gallery = require('../models/gallery');
const User = require('../models/user');

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();


router.use((req, res, next) => {
   res.locals.user = req.user;
   next();
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', { title: '회원가입' });
});

router.get('/', async (req, res, next) => {
  var message;
 
  if(req.user){
    message = await Message.find({ to: req.user.UserId}).sort({date: -1});;
  }
  res.render('main', {
    title: "HOME",
    messages: message
  });
});
router.post('/message/delete', isLoggedIn, async(req,res,next)=>{
  try{
    await Message.deleteOne({ _id: req.body._id });
    res.redirect('back');

  }catch(err){
    console.error(err);
    next(err);
  }
});

router.post('/message', isLoggedIn, async(req, res, next) => {
  try{
    const exUser = await User.findOne( {UserId:req.body.to });
    if(!exUser){
      const message= encodeURIComponent('없는 사용자입니다.');
      res.redirect(`./?loginError=${message}`);
    }else{
      var date = moment(Date.now()).format('YYYY MMMM Do , hh:mma');
      await Message.create({
        from: req.user.UserId,
        to: req.body.to,
        message: req.body.message,
        date: date
      });
      res.redirect('/');
    }
  }catch(error){
    console.error(error);
    next(error);
  }
});


router.get('/search', async (req, res, next) => {
  const query = req.query.search;
  const type = req.query.type;
  var board;
  var gallery;
 
  if (!query) {
    return res.redirect('/');
  }
  try {
    if(type === "본문"){
      //내용 검색
      board = await Board.find({ content: {$regex: query}});
      gallery = await Gallery.find({ content: {$regex: query}});
    }else if(type === "ID"){
      //작성자 검색
    
      board = await Board.find({ writer: query});
      gallery = await Gallery.find( { writer: query });
    }else{
      //HASH TAG 검색
      const hashtag = await Hashtag.findOne({ title: query  });
    
      if (hashtag) {
        board = await Board.find( {content:{$regex: '.*#'+query+'.*'}});
        gallery = await Gallery.find( {content:{$regex: '.*#'+query+'.*'}});
      }
    }
    
    return res.render('main', {
      title: `${type} | ${query} | 검색결과`,
      boards: board,
      galleris: gallery,
      type: type,
      query: query,
    });

  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;