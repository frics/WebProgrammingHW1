const express = require('express');
const moment = require("moment");
//멀티파트 데이터 형식 전송을 위해 사용(이미지, 동영상)
//나중에 이미지 업로드 기능할때 마저 구현
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Message = require('../models/message');
const Gallery = require('../models/gallery');
const Hashtag = require('../models/hashtag');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();


try {
  console.log('OPEN DIR');
  fs.readdirSync('uploads');
}catch(error){
  console.error('Cannot find uploads dir \n Create uploads dir');
  fs.mkdirSync('uploads');
}



const upload = multer({
  //저장 공간 정보 
  //하드디스크에 업로드 파일 저장
  storage: multer.diskStorage({
    //저장 경로
    destination(req, file, cb){
            cb(null, 'uploads/');
    },
    //저장할 파일 이름, 날짜, 확장자
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  //파일 개수, 파일 사이즈 제한
  limits: { fileSize: 30 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  res.json({ url: `/img/${req.file.filename}` });
});

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  try { 
    const post = await Gallery.create({
      content: req.body.content,
      img: req.body.url,
      writer: req.user.UserId,
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

    res.redirect('/gallery');
  } catch (error) {
    console.error(error);
    next(error);
  }
});



router.post('/page', async(req, res, next)=>{
  try{
   
    var gallery = await Gallery.findOne({ _id: req.body._id});

    if(gallery){
      const date = moment(gallery.createdAt).format('YYYY MMMM Do , hh:mm');

      res.render('image', {
        gallery : gallery,
        date: date,
      });
    }else{
      res.redirect('/gallery');
    }
  }catch(err){
    console.error(err);
    next(err);
  }
});

router.post('/modify',isLoggedIn, upload2.none(), async(req, res, next)=>{
  try{
    
     const gallery = await Gallery.updateOne(
       { _id:req.body._id },
       {  img:req.body.url, content: req.body.content }
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

    if(req.body.old !== req.body.url ){
      const filePath = './uploads/' + path.basename(req.body.old);
      fs.unlink(filePath, (err)=>{
        console.error(err);
      });
    }
  
    res.redirect('/gallery');
   
  }catch(err){
    console.error(err);
    next(err);
  }
    
});

router.post('/delete',isLoggedIn, async(req, res, next)=>{
  try{
   
    const gallery = await Gallery.deleteOne({_id:req.body._id});
    
    const filePath = './uploads/' + path.basename(req.body.img);
    fs.unlink(filePath, (err)=>{
      console.error(err);
    })
    res.redirect('/gallery');

  }catch(err){
    console.error(err);
    next(err);
  }
    
});
router.get('/search', async (req, res, next) => {
  const query = req.query.search;
  const type = req.query.type;
  var gallery;
 
  if (!query) {
    return res.redirect('/');
  }
  try {
    if(type === "content"){
      //내용 검색
      gallery = await Gallery.find({ content: {$regex: query}});
    }else if(type === "writer"){
      //작성자 검색
      gallery = await Gallery.find( { writer: query });
    }else{
      //HASH TAG 검색
      const hashtag = await Hashtag.findOne({ title: query  });
      if (hashtag) {
        gallery = await Gallery.find( {content:{$regex: '.*#'+query+'.*'}});
      }
    }
    
    return res.render('gallery', {
      title: `${type} | ${query} | 검색결과`,
      galleris: gallery,
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
    const gallery = await Gallery.find({}).sort({createdAt: -1});
   
    res.render('gallery', {
      title: "GALLERY",
      galleris: gallery,
      messages: message
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
