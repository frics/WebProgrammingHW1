const express = require('express');
//const moment = require("moment");
//멀티파트 데이터 형식 전송을 위해 사용(이미지, 동영상)
//나중에 이미지 업로드 기능할때 마저 구현
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Gallery = require('../models/gallery');
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
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log("!!!!!!!!!!!!!!!!!!!!!!!"+req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  try { 
    console.log(req.user);
    console.log(req.body);
    const post = await Gallery.create({
      content: req.body.content,
      img: req.body.url,
      writer: req.user.UserId,
    });
    //const hashtags = req.body.content.match(/#[^\s#]*/g);
    /*if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          })
        }),
      );
      await post.addHashtags(result.map(r => r[0]));
    }*/
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/delete',isLoggedIn, async(req, res, next)=>{
  try{
    console.log("삭제할 내용 확인");
    console.log(req.body);
    const gallery = await Gallery.deleteOne({_id:req.body._id});
    res.redirect('/gallery');
  }catch(err){
    console.error(err);
    next(err);
  }
    
});


router.get('/', async (req, res, next) => {
  try {
    const gallery = await Gallery.find({});
    console.log(gallery);
    res.render('gallery', {
      galleris: gallery,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
