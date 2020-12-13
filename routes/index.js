const express = require('express');

const Board = require('../models/board');
const Gallery = require('../models/gallery');

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
  res.render('main', {
    title: "HOME"
  });
});


router.get('/search', async (req, res, next) => {
  const query = req.query.search;
  
  console.log("printf query : " + req.query.search);
  if (!query) {
    return res.redirect('/');
  }
  try {
    //작성자 검색
    const boardWriter = await Board.find({ writer: query});
    const galleryWriter = await Gallery.find( { writer: query });
    //내용 검색
    const boardContent = await Board.find({ content: {$regex: query}});
    const galleryContent = await Gallery.find({ content: {$regex: query}});
    //HASH TAG 검색
   // posts= await Image.find({content:{$regex: '.*#'+query+'.*'}});
    
    //검색 결과 객체 합치기
    const board = Object.assign(boardWriter, boardContent);
    const gallery = Object.assign(galleryWriter, galleryContent);
    
    
    const hashtag = await Hashtag.findOne({ title: query  });
    /*
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }*/

    return res.render('main', {
      title: `${query} | HOME`,
      boards: board,
      galleris: gallery
    });

  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;